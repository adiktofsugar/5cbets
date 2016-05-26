/* global GOOGLE_SIGN_IN_CLIENT_ID */
import React from 'react';
import gapi from 'gapi';

// https://developers.google.com/identity/sign-in/web/
// seems better to just make my own button, since I'm managing the state anyway

// function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail());
// }

export default React.createClass({
    // componentWillMount() {
    //     auth2.isSignedIn.listen(this.signinChanged);
    //     auth2.currentUser.listen(this.userChanged);
    //     if (auth2.isSignedIn.get() == true) {
    //         auth2.signIn();
    //     }
    //     var googleUser = auth2.currentUser.get();
    //     this.setState({ googleUser });
    // },
    getInitialState() {
        return {};
    },
    componentWillMount() {
    },
    componentWillUnmount() {
    },
    // signinChanged(val) {
    //     console.log('Signin state changed to ', val);
    // };
    // userChanged(googleUser) {
    //     console.log('User now: ', googleUser);
    //     this.setState({ googleUser });
    //     // updateuser
    //     // if (googleUser) {
    //     //     document.getElementById('user-id').innerText = googleUser.getId();
    //     //     document.getElementById('user-scopes').innerText =
    //     //       googleUser.getGrantedScopes();
    //     //     document.getElementById('auth-response').innerText =
    //     //       JSON.stringify(googleUser.getAuthResponse(), undefined, 2);
    //     //   } else {
    //     //     document.getElementById('user-id').innerText = '--';
    //     //     document.getElementById('user-scopes').innerText = '--';
    //     //     document.getElementById('auth-response').innerText = '--';
    //     //   }
    // },

    loadAuth2() {
        gapi.load('auth2', () => {
            var auth2 = gapi.auth2.init({
                client_id: GOOGLE_SIGN_IN_CLIENT_ID,
                //cookie_policy: URI, single_host_origin, or none,
                //scope: "profile,email",
                //fetch_basic_profile: true | false,
                //hosted_domain: apps domain user must belong,

            });
            this.setState({ auth2 });
        });
    },
    loadSignin2() {
        gapi.load('signin2', () => {
            this.setState({ signin2: gapi.signin2 });
        });
    },

    handleSignOutClick(event) {
        event.preventDefault();
        this.state.auth2.disconnect();
    },
    render() {
        if (this.state.error) {
            return <div>Error: {this.state.error}</div>
        }

        if (!this.state.auth2) {
            this.loadAuth2();
            return <div>Loading auth2...</div>
        }
        if (!this.state.signin2) {
            this.loadSignin2();
            return <div>Loading signin2...</div>
        }
        setTimeout(() => {
            this.state.signin2.render('g-signin', {
                'scope': 'profile email',
                'width': 240,
                'height': 50,
                'longtitle': true,
                'theme': 'dark'
            });
        }, 1);
        return (
            <div>
                <div id="g-signin"></div>
                <a href="#" onClick={this.handleSignOutClick}>Sign Out</a>
            </div>
        );
    }
});
