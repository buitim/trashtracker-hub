import React from 'react';
import { Typography } from 'antd';
import { withRouter } from 'react-router-dom';
const { Title } = Typography;

export class VoteView extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }
    
    componentDidMount() {
        this.props.onRouteChange('3');
        this.setState({ isLoading: false });
    }
    
    render() {
        return(
            <>
            lol
            </>
        );
    }
}

export default withRouter(VoteView);