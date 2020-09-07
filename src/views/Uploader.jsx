import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

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
            :   <p>Please login</p>

        );
    }
}

export default UploadView;