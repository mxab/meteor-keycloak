const loader = new Promise((resolve, reject) => {


    Meteor.autorun(function(c) {
        if (Accounts.loginServicesConfigured()) {
            c.stop();
            start();
        }
    });

    function start() {
        const config = ServiceConfiguration.configurations.findOne({ service: 'keycloak' });
        if (!config || !config["auth-server-url"]) {
            throw new ServiceConfiguration.ConfigError();
        }
        const authServerUrl = config["auth-server-url"];

        const script = document.createElement('script');

        script.onload = function() {

            MeteorKeycloak.Keycloak = window.Keycloak

            const kc = {};
            kc.authServerUrl = config['auth-server-url'];
            kc.realm = config['realm'];
            kc.clientId = config['resource'];
            kc.clientSecret = (config['credentials'] || {})['secret'];
            resolve(new window.Keycloak(kc));
        };
        script.onerror = reject;
        script.src = `${authServerUrl}/js/keycloak.min.js`;

        document.head.appendChild(script);
    }
});
MeteorKeycloak.loader = loader;