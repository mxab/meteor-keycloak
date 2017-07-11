const keycloakServiceName = 'keycloak';
Accounts.oauth.registerService(keycloakServiceName);

if (Meteor.isClient) {
    const loginWithMeteorKeycloak = function(options, callback) {
        // support a callback without options
        if (!callback && typeof options === "function") {
            callback = options;
            options = null;
        }

        const credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
        MeteorKeycloak.requestCredential(options, credentialRequestCompleteCallback);
    };
    Accounts.registerClientLoginFunction(keycloakServiceName, loginWithMeteorKeycloak);
    Meteor.loginWithMeteorKeycloak = function() {
        return Accounts.applyLoginFunction(keycloakServiceName, arguments);
    };
} else {
    Accounts.addAutopublishFields({
        forLoggedInUser: ['services.keycloak'],
        forOtherUsers: [
            'services.keycloak.id', 'services.keycloak.name'
        ]
    });
}