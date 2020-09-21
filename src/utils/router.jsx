import React from 'react';
import { Switch, Route } from "react-router-dom";
import HomeView from '../views/Home';
import UploadView from '../views/Uploader';
import VoteView from '../views/Vote';
import BracketView from '../views/Bracket';

export class AppRouter extends React.Component {
    render(){
        return(
            <Switch>
                <Route path='/upload'>
                    <UploadView onRouteChange={this.props.onRouteChange} userData={this.props.userData}/>
                </Route>
                <Route path='/vote'>
                    <VoteView onRouteChange={this.props.onRouteChange} userData={this.props.userData}/>
                </Route>
                <Route path='/bracket'>
                    <BracketView onRouteChange={this.props.onRouteChange} userData={this.props.userData}/>
                </Route>
                <Route path='/'>
                    <HomeView onRouteChange={this.props.onRouteChange}/>
                </Route>
                <Route path='*'>
                    {/* TODO: Replace with 404 */}
                    <HomeView onRouteChange={this.props.onRouteChange}/>
                </Route>
            </Switch>
        );
    }
}

export default AppRouter;