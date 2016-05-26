import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import GoogleSignIn from 'presentation/google-sign-in';

$(function () {
    ReactDOM.render(
        <GoogleSignIn />,
        document.getElementById('content')
    );
});
