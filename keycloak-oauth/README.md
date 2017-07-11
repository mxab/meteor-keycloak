## Setup

1. Create a realm in keycloak
2. Create a client in this realm

Register OIDC settings, something like this:
```

ServiceConfiguration.configurations.upsert(
    {service: 'keycloak'},
    {
        $set: {
            "realm": "my-realm-123",
            "auth-server-url": "http://my.keycloak.domain/auth",
            "ssl-required": "external",
            "resource": "the-meteor-app-client-id",
            "public-client": true,
            "use-resource-role-mappings": true,
            "bearer-only": true,
            "realm-public-key": "PUBLICRSAKEY12312313"
        }
    }
);

```


