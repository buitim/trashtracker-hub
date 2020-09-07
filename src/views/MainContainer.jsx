import React from 'react';
import '../styles/App.css';
import { Link, withRouter } from "react-router-dom";
import { Layout, Menu, Button, Tooltip } from 'antd';
import AppRouter from '../utils/router';
import queryString from 'query-string';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout;

const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const authUri = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURI(redirectUri)}&response_type=token&scope=identify`;
const sha = process.env.REACT_APP_SHA.substring(0, 7);

export class MainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKey: ['1'],
            userData: { isLoggedIn: false }
        };
    }

    componentDidMount(){
        this.handleDiscordToken();
    }

    onRouteChange = (val) => {
        // console.log(val);
        this.setState({ selectedKey: [val]});
    }

    handleDiscordToken = async () => {
        let token = '';
        if (localStorage.getItem('trashHubToken'))
        {
            /* If the token exists in local storage */
            token = localStorage.getItem('trashHubToken');
        }
        else if (queryString.parse(this.props.location.hash).access_token){
            /* If the url contains a jwt */
            token = queryString.parse(this.props.location.hash).access_token;
            localStorage.setItem('trashHubToken', token);
        }
        else {
            /* User does not have a jwt or token. Abort */
            return;
        }

        try {
            /* Use the token to get user data */
            const res = await axios({
                url: 'https://discord.com/api/users/@me',
                headers: {
                    authorization: `Bearer ${token}`
                }
            })

            /* Add data to state */
            this.setState({ 
                userData: {
                    userName: `${res.data.username}#${res.data.discriminator}`,
                    userAvatar: `https://cdn.discordapp.com/avatars/${res.data.id}/${res.data.avatar}.png`,
                    isLoggedIn: true
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div>
                <Layout className='layout-container'>
                    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                        <Link to='/home'>
                            <div className="logo" />
                        </Link>
                        <div className='login'>
                            <Tooltip title={this.state.userData.userName ? 'Logged in!' : 'Click to log in with Discord'}>
                                <Button 
                                    type='primary' 
                                    icon={<UserOutlined />}
                                    disabled={this.state.userData.userName}
                                    href={authUri}>
                                        {this.state.userData.userName || 'Login'}
                                </Button>
                            </Tooltip>
                        </div>
                        <Menu theme="dark" mode="horizontal" selectedKeys={this.state.selectedKey}>
                            <Menu.Item key="1">
                                <Link to='/'>Home</Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to='/upload'>Competition Uploader</Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content className="site-layout" style={{ padding: '2rem', marginTop: 64 }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                            <AppRouter onRouteChange={this.onRouteChange} userData={this.state.userData}/>
                        </div>
                    </Content>
                    <Footer className='layout-footer'>Tim Bui ©2020 | Created with ❤ for TrashTrackers Discord Server | {sha}</Footer>
                </Layout>
            </div>
        );
    }
}

export default withRouter(MainContainer);
