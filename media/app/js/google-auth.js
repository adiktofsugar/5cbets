/* global GOOGLE_SIGN_IN_CLIENT_ID */
import gapi from 'gapi';



var auth2 = gapi.auth2.init({
    client_id: GOOGLE_SIGN_IN_CLIENT_ID,
    //cookie_policy: URI, single_host_origin, or none,
    //scope: "profile,email",
    //fetch_basic_profile: true | false,
    //hosted_domain: apps domain user must belong,

});

export default auth2;
