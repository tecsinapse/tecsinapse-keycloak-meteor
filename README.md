# tecsinapse-keycloak-meteor

This package is an integration between [tecsinapse-keycloak-js](https://github.com/tecsinapse/tecsinapse-keycloak-js) and meteor accounts package.

## How to use tecsinapse-keycloak-meteor

Use `meteor add tecsinapse:keycloak-meteor` to add this package in your project.

## Configuring the service

This package use [`service-configuration`](https://atmospherejs.com/meteor/service-configuration) to save your keycloak options. Create a settings.json with options like this,

```
{
  "keycloak": {
      "realm": "yourRealm",
      "clientId": "yourClient",
      "urlServer": "https://auth.yourKeycloak.com",
      "adminUsername": "admin@yourUser.com",
      "adminPassword": "yourAdminPass"
    }
}
```

and write this code in your server:

 ```
 import {Accounts} from 'meteor/accounts-base';
 Accounts.keycloakConfig(Meteor.settings.keycloak);
 ```

 ## Logging up with Accounts

 Call `Accounts.loginWithKeycloak(username, password)`;

 ## Logging out with Accounts

 Call `Accounts.logoutKeycloak()`;
