import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import cognitoUtils from '../lib/cognitoUtils';
import sessionUtils from '../lib/session';

class LoginPage extends Component {
    componentDidMount () {
        cognitoUtils.parseCognitoWebResponse(window.location.href) // parse the callback URL
              .then(() => cognitoUtils.getCognitoSession()) // get a new session
              .then((session) => {
                sessionUtils.setSession(session);
                window.location = '/documents';
            }).catch(err => {
                console.log(err);
                window.location = cognitoUtils.getCognitoSignInUri();
            });
    }

    render () {
        if (sessionUtils.isLoggedIn()) {
            return <Redirect to="/documents" />
        }
        return <div/>
    }
}

export default LoginPage
