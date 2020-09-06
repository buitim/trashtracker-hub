import React from 'react';
import { Typography, Divider } from 'antd';
import { withRouter } from 'react-router-dom';
const { Title, Paragraph, Text } = Typography;

export class HomeView extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }
    
    componentDidMount() {
        this.props.onRouteChange('1');
        this.setState({ isLoading: false });
    }
    
    render() {
        return(
            <Typography>
                <Title>Welcome To TrashHub</Title>
                <Paragraph>This is a paragraph. <Text code>This is some code</Text></Paragraph>
                <Divider/>
            </Typography>
        );
    }
}

export default withRouter(HomeView);