# Setup

```
meteor add mxab:accounts-keycloak
```

## Local setup with docker
```
docker run -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin jboss/keycloak
```

Setup keycloak under http://localhost:8080/auth/admin/

1. Create a new realm in keycloak
2. Create a client in this realm

Register OIDC settings, something like this:
```

ServiceConfiguration.configurations.upsert(
    {service: 'keycloak'},
    {
        $set: {
            "realm": "my-realm-123",
            "auth-server-url": "http://localhost:8080/auth",
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


