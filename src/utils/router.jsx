import React from 'react';
import { Switch, Route } from "react-router-dom";
import HomeView from '../views/Home';
import UploadView from '../views/Uploader';

export class AppRouter extends React.Component {
    render(){
        return(
            <Switch>
                <Route path='/home'>
                    <HomeView onRouteChange={this.props.onRouteChange}/>
                </Route>
                <Route path='/upload'>
                    <UploadView onRouteChange={this.props.onRouteChange} userData={this.props.userData}/>
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