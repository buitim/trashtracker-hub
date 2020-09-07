import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;

const uploadProps = {
    // name: 'henlo',
    accept: 'image/*',
    action: 'https://api.cloudinary.com/v1_1/buitim/image/upload',
    data: { upload_preset: 'ewtam4l1' },
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log('[+] Upload finished');
            // console.log(info.file, info.fileList);
        }
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

    uploader = async (file) => {
        console.log(file);
        try {
            const res = await axios({
                method: 'POST',
                url: 'https://api.cloudinary.com/v1_1/buitim/image/upload',
                data: {
                    file: file,
                    upload_preset: 'ewtam4l1'
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Upload your submission image here
                </p>
            </Dragger>
        );
    }
}

export default UploadView;