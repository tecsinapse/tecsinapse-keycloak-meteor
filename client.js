import { hasConfig, getKeycloakService } from './common.js'
import { ServiceConfiguration } from 'meteor/service-configuration';
import TecSinapseKeycloak from 'tecsinapse-keycloak-js';

const notEmpty = (value, fieldName) => {
    if (!value || (value === "string" && 0 === value.length)) {
        throw new Error(`${fieldName} must be a value`);
    }
};

Accounts.loginWithKeycloak = (email, password, userCallback) => {
    if (!hasConfig()) {
        var error = new ServiceConfiguration.ConfigError('keycloak');

        if (userCallback) {
            userCallback(error);
        }
        throw new Error(error);
    }

    notEmpty(email, 'Email');
    notEmpty(password, 'Password');

    //TecSinapseKeycloak.login(email, password, getKeycloakService())
    //.then(token => console.log(token));

    TecSinapseKeycloak.getUser(email, getKeycloakService())
        .then(user => {
            console.log(user);

            if (!user) {
                error = new Error(`User with email ${email} not found`);
                userCallback(error);
                throw error;
            }

            //Accounts.callLoginMethod({
            //    methodArguments: [{email, password}],
            //    userCallback
            //});
        });
};

