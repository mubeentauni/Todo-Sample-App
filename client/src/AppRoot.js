import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect
} from 'react-router-dom';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941

import './App.css';
import UserStore from './stores/UserStore';
import Login from './user/login';
import Register from './user/register';
import App from './App';

// injectTapEventPlugin();


class AppRoot extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
        }
    }



    loggedIn() {
       return localStorage.getItem('userToken');
    }

    render() {
        return (
            <MuiThemeProvider>
                <Router>
                    <div className="App">
                        <Route exact path="/" render={props => (
                            !this.loggedIn() ? (
                                <Redirect to={{
                                    pathname: '/login'
                                }} />
                            ) : (
                                <Redirect to={{
                                    pathname: '/todo'
                                }} />
                            )
                        )} />
                        <Route exact path="/login"  render={props => (
                            !this.loggedIn() ? (
                                <Login />
                                ) : (
                                <Redirect to={{
                                    pathname: '/todo'
                                }} />
                            )
                        )}/>
                        <Route exact path="/register"  render={props => (
                            !this.loggedIn() ? (
                                <Register />
                            ) : (
                                <Redirect to={{
                                    pathname: '/todo'
                                }} />
                            )
                        )}/>
                        <Route exact path="/todo"  render={props => (
                            this.loggedIn() ? (
                                <App />
                            ) : (
                                <Redirect to={{
                                    pathname: '/login'
                                }} />
                            )
                        )}/>
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}

const style = {
    margin: 15,
};

export default withCookies(AppRoot);
