MeteorKeycloak = {};

// Request MeteorKeycloak credentials for the user
//
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
MeteorKeycloak.requestCredential = function(options, credentialRequestCompleteCallback) {
    // support both (options, callback) and (callback).
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    }

    const serviceName = 'keycloak';

    const config = ServiceConfiguration.configurations.findOne({ service: serviceName });
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(
            new ServiceConfiguration.ConfigError());
        return;
    }
    const authServerUrl = config["auth-server-url"];
    const realm = config['realm'];
    const clientId = config["resource"];


    const credentialToken = Random.secret();

    const loginStyle = "redirect";


    const realmUrl = `${authServerUrl}/realms/${realm}`;
    const redirectUri = OAuth._redirectUri(serviceName, config);
    const state = OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl);


    let loginUrl = realmUrl +
        '/protocol/openid-connect/auth' +
        '?client_id=' + encodeURIComponent(clientId) +
        '&redirect_uri=' + redirectUri +
        '&state=' + state +
        '&nonce=' + encodeURIComponent(Random.secret()) +
        '&response_mode=' + encodeURIComponent('query') +
        '&response_type=' + encodeURIComponent('code') +
        '&scope=' + encodeURIComponent("oidc");



    // Handle authentication type (e.g. for force login you need auth_type: "reauthenticate")
    if (options && options.auth_type) {
        loginUrl += "&auth_type=" + encodeURIComponent(options.auth_type);
    }

    OAuth.launchLogin({
        loginService: serviceName,
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken
    });
};