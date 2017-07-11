import { Config, GrantManager } from "keycloak-auth-utils";

MeteorKeycloak = {};
/**
 *
 * @param {Grant} grant
 * @param expiresAt
 * @returns {{serviceData: {accessToken: *, expiresAt: *}, options: {profile: {name}}}}
 */
MeteorKeycloak.handleAuthFromAccessToken = function handleAuthFromAccessToken(grant, expiresAt) {


    const content = grant.access_token.content;


    const identity = {
        id: content.sub,
        email: content.email,
        name: content.name,
        given_name: content.given_name,
        family_name: content.family_name
    };

    const serviceData = {
        accessToken: grant.access_token.token,
        expiresAt: expiresAt
    };

    _.extend(serviceData, identity);

    return {
        serviceData: serviceData,
        options: { profile: { name: identity.name } }
    };
};

OAuth.registerService('keycloak', 2, null, function(query) {
    const grant = getGrant(query);
    const expiresIn = grant.expires_in;

    return MeteorKeycloak.handleAuthFromAccessToken(grant, (+new Date) + (1000 * expiresIn));
});


/**
 *
 * @param query
 * @returns {Grant}
 */
function getGrant(query) {


    const config = getKeycloakConfig();

    const grantManager = new GrantManager(new Config(config));

    const redirectUri = OAuth._redirectUri('keycloak', config);

    const code = query.code;

    const result = Meteor.wrapAsync(function(grantManager, auth_redirect_uri, code, callback) {
        grantManager.obtainFromCode({ session: { auth_redirect_uri: auth_redirect_uri } }, code, null, null, callback);
    })(grantManager, redirectUri, code);
    return result;


};

MeteorKeycloak.retrieveCredential = function(credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

function getKeycloakConfig() {
    const config = ServiceConfiguration.configurations.findOne({ service: 'keycloak' });
    if (!config) {
        throw new ServiceConfiguration.ConfigError();
    }
    return config;
}