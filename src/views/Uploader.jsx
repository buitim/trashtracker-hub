import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const uploadProps = {
    name: 'henlo',
    accept: 'image/*',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
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
        this.setState({ isLoading: false });
        this.props.onRouteChange('2');
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