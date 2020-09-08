import React from 'react';
import { db, fbStorage } from '../utils/firebase.js';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Result, Button, Typography, Skeleton } from 'antd';
import { UserOutlined } from '@ant-design/icons'

const { Dragger } = Upload;
const { Title, Text} = Typography;

const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const authUri = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURI(redirectUri)}&response_type=token&scope=identify`;

/* CHANGE THIS FOR NUMBER OF UPLOADS AVAILABLE */
const uploadLimit = 5;

export class UploadView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUploaderDisabled: false,
            uploadCount: -1,
            isUserDataLoaded: false,
            isLoading: true
        };
    }

    componentDidMount() {
        this.props.onRouteChange('2');
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

    getUserUploadData = async () => {
        try {
            if (this.props.userData.userName) {
                const collection = db.collection('upload').doc(this.props.userData.userName);
                const doc = await collection.get();
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
                        const data = { uploadCount: uploadLimit }
                        await collection.set(data); 
                        this.setState({ uploadCount: uploadLimit });
                    }   
                }
                // If the user does not have data, init to 5 uploads
                else {
                    const data = { uploadCount: uploadLimit }
                    await collection.set(data);
                    this.setState({ uploadCount: uploadLimit });
                }   

                this.setState({ isUserDataLoaded: true });
            }
        } catch (error) {
            console.log(error);
        }
    }

    putData = async (data) => {
        const collection = db.collection('upload').doc(this.props.userData.userName);
        await collection.set(data);
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
                        <Title level={3}>{titleText}</Title>
                        <Title type='secondary' level={5} style={{ marginBottom:'2rem' }}>{subText}</Title>
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
                                    Upload your submission image here. Files are immediately uploaded.
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
        
        return <Skeleton />; 
    }

    render() {
        return (
            <this.Content />
        );
    }
}

export default UploadView;