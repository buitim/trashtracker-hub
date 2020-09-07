import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons'

const { Dragger } = Upload;

const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const authUri = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURI(redirectUri)}&response_type=token&scope=identify`;

const uploadProps = {
    accept: 'image/*',
    action: 'https://api.cloudinary.com/v1_1/buitim/image/upload',
    data: { upload_preset: 'ewtam4l1' },
    showUploadList: false,
    onChange(info) {
        const { status } = info.file;
        if (status === 'done') {
            message.success(`${info.file.name} uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} upload failed.`);
        }
    },
};


export class UploadView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    componentDidMount() {
        this.props.onRouteChange('2');
        this.setState({ isLoading: false });
    }

    createId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    transformFile = (file) => {
        const username = this.props.userData.userName.split('#')[0];
        const extension = file.name.split('.')[1];
        const id = this.createId();
        let newFile = new File([file], `${username}-${id}.${extension}`);
        return newFile;
    }

    render() {
        return (
            this.props.userData.isLoggedIn 
            ?   <Dragger {...uploadProps} transformFile={this.transformFile}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Upload your submission image here. Files are immediately uploaded.
                    </p>
                </Dragger>
            :   <Result 
                    status='500'
                    title='Please log in to upload'
                    extra={<Button type='primary' icon={<UserOutlined />} href={authUri}>Login</Button>}
                />

        );
    }
}

export default UploadView;