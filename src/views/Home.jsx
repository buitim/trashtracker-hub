import React from 'react';
import { Typography } from 'antd';
import { withRouter } from 'react-router-dom';
const { Title } = Typography;

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
            <>
                <Typography>
                    <Title>Welcome To TrashHub</Title>
                </Typography>
                <iframe title='Discord Widget' src="https://discordapp.com/widget?id=507367480268947456&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
            </>
        );
    }
}

export default withRouter(HomeView);