# Setup

```
meteor add mxab:accounts-keycloak
```

## Local demo with docker
```
docker run -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin jboss/keycloak
```

Setup keycloak under http://localhost:8080/auth/admin/