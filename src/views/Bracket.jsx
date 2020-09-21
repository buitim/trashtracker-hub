import React from 'react';
import { Typography } from 'antd';
import { withRouter } from 'react-router-dom';
const { Title } = Typography;

export class BracketView extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }
    
    componentDidMount() {
        this.props.onRouteChange('4');
        this.setState({ isLoading: false });
    }
    
    render() {
        return(
            <>
                <Typography>
                    <Title>Contest Bracket</Title>
                </Typography>
                <iframe 
                    title='Bracket'
                    src="https://challonge.com/o3n8yfg0/module"
                    width="100%" 
                    height="650" 
                    frameborder="0" 
                    scrolling="auto" 
                    allowtransparency="true" 
                />
            </>
        );
    }
}

export default withRouter(BracketView);