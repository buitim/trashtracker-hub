import React from 'react';
import Countdown from 'react-countdown';
import { DateTime } from 'luxon';
import { db, fbStorage } from '../utils/firebase.js';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Result, Button, Typography, Skeleton } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const authUri = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURI(redirectUri)}&response_type=token&scope=identify`;

export class UploadView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUploaderDisabled: false,
            uploadCount: -1,
            isUserDataLoaded: false,
            isPastDeadline: false,
            deadline: {},
            isLoading: true
        };
    }

    componentDidMount() {
        this.props.onRouteChange('2');
        this.getDeadline();
        this.getUserUploadData();
        this.setState({ isLoading: false });
    }

    componentDidUpdate(prevProps) {
        if (this.props.userData !== prevProps.userData) {
            this.getUserUploadData();
        }
    }

    createId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    getDeadline = async () => {
        try {
            const collection = db.collection('config').doc('uploadCompetition');
            const doc = await collection.get();
            const currTime = DateTime.local();
            const deadlineInMillis = doc.data().deadline.toMillis();
            const uploadLimit = doc.data().uploadLimit;
            let additionalState = {};

            // Check if deadline has passed
            if (deadlineInMillis - currTime.ts < 0) {
                additionalState = { isPastDeadline: true, isUploaderDisabled: true }
            }

            this.setState({ 
                ...additionalState,
                deadline: DateTime.fromSeconds(doc.data().deadline.seconds),
                uploadLimit: uploadLimit
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    getUserUploadData = async () => {
        try {
            if (this.props.userData.userName) {
                const collection = db.collection('userData').doc(this.props.userData.userName);
                const doc = await collection.get();
                let data = doc.data();

                // If the user has data
                if(doc.exists){
                    // Check if number of uploads exists
                    const uploadCount = doc.data().uploadCount;
                    
                    // If 0, block uploads
                    if (uploadCount === 0) {
                        message.error('You have hit your upload limit.');
                        this.setState({ isUploaderDisabled: true, uploadCount: 0 });
                    }
                    else if (uploadCount > 0) {
                        this.setState({ uploadCount: uploadCount });
                    }
                    /* Edge case where document exists but entry does not */
                    else {
                        data = { ...data, uploadCount: this.state.uploadLimit };
                        await collection.set(data); 
                        this.setState({ uploadCount: this.state.uploadLimit });
                    }   
                }
                // If the user does not have data, init to 5 uploads
                else {
                    data = { ...data, uploadCount: this.state.uploadLimit };
                    await collection.set(data);
                    this.setState({ uploadCount: this.state.uploadLimit });
                }   

                this.setState({ isUserDataLoaded: true });
            }
        } catch (error) {
            console.log(error);
        }
    }

    putData = async (data) => {
        try {
            const collection = db.collection('userData').doc(this.props.userData.userName);
            const docData = (await collection.get()).data();
            const newData = { ...docData, ...data };
            await collection.set(newData);
        } catch (error) {
            console.log(error);
        }
    }

    onUploadChange = (info) => {
        const { status } = info.file;
        if (status === 'done') {
            message.success(`${info.file.name} uploaded successfully.`);
            const data = { uploadCount: this.state.uploadCount - 1 };
            this.putData(data);
            this.setState({ uploadCount: data.uploadCount });

            if (data.uploadCount === 0) {
                message.error('You have hit your upload limit.');
                this.setState({ isUploaderDisabled: true, uploadCount: 0 });
            }
        } else if (status === 'error') {
            message.error(`${info.file.name} upload failed.`);
        }
    }

    onUpload = async ({ onError, onSuccess, file }) => {
        const username = this.props.userData.userName.split('#')[0];
        const extension = file.name.split('.')[1];
        const id = this.createId();
        const fileRef = fbStorage.child(`ServerIcon/${this.props.userData.userName}/${username}-${id}.${extension}`);

        try {
            const res = await fileRef.put(file);
            onSuccess(null, res);
        } catch (error) {
            console.log(error);
            onError(error);
        }
    }

    Content = () => {
        if (!this.state.isLoading) {
            if(this.state.isUserDataLoaded) {
                let titleText = '', subText = '';

                if (this.state.uploadCount === 1)
                    titleText = `You have ${this.state.uploadCount} upload remaining`;
                else if (this.state.uploadCount > 0)
                    titleText = `You have ${this.state.uploadCount} uploads remaining`;
                else if (this.state.uploadCount === 0) {
                    titleText = 'You have no uploads remaining';
                    subText = 'Contact solit#2035 if you would like a reset'
                }

                return (
                    <>
                        <Title level={4}>{titleText}</Title>
                        <Title type='secondary' level={5}>{subText}</Title>

                        <div style={{ marginBottom:'1.2rem' }}>
                            <Text strong>Deadline: </Text>
                            <Text>{this.state.deadline.toLocaleString(DateTime.DATETIME_FULL)}</Text>

                            <br />

                            {this.state.isPastDeadline
                            ? <Text type='danger'>Deadline has passed</Text>
                            : <Text type='secondary'> <Countdown date={this.state.deadline.toMillis()} /> until deadline </Text> }
                        </div>

                        <Dragger
                            customRequest={(this.onUpload)}
                            disabled = {this.state.isUploaderDisabled}
                            onChange = {this.onUploadChange}
                            accept = 'image/*'>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    {this.state.isUploaderDisabled
                                    ? 'Uploader is disabled.'
                                    : 'Upload your submission image here. Files are immediately uploaded.'}
                                    
                                </p>
                        </Dragger>
                    </>
                );
            }
            else {
                if (!this.props.userData.isLoggedIn) {
                    return (
                        <Result
                            status='500'
                            title='Please log in to upload'
                            extra={<Button type='primary' icon={<UserOutlined />} href={authUri}>Login</Button>}
                        />
                    );
                }
            }
        }
        
        return <Skeleton active />; 
    }

    render() {
        return (
            <this.Content />
        );
    }
}

export default UploadView;