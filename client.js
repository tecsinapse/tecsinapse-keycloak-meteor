import { Accounts } from 'meteor/accounts-base';
import { hasConfig, getKeycloakService, isLoggedDep, checkCallbackFunction } from './common.js'
import { ServiceConfiguration } from 'meteor/service-configuration';
import TecSinapseKeycloak from 'tecsinapse-keycloak-js';

const notEmpty = (value, fieldName) => {
    if (!value || (value === "string" && 0 === value.length)) {
        throw new Error(`${fieldName} must be a value`);
    }
};

const createOrUpdateUser = (userKC, userCallback) => {
    let user = {
        id: userKC.id,
        username: userKC.username,
        firstName: userKC.firstName,
        email: userKC.email,
        enabled: userKC.enabled
    };

    TecSinapseKeycloak.getRoles(getKeycloakService(), user.id)
        .then(roles => {
            user.roles = roles;
            Accounts.callLoginMethod({
                methodArguments: [user],
                userCallback
            });
        });
};

Accounts.loginWithKeycloak = (email, password, userCallback) => {

    checkCallbackFunction(userCallback);

    if (!hasConfig()) {
        var error = new ServiceConfiguration.ConfigError('keycloak');

        if (userCallback) {
            userCallback(error);
        }
        throw new Error(error);
    }

    notEmpty(email, 'Email');
    notEmpty(password, 'Password');

    if (Accounts.isLogged()) {
        return;
    }

    TecSinapseKeycloak.login(email, password, getKeycloakService())
        .then(accessToken => TecSinapseKeycloak.getUser(email, getKeycloakService()))
        .then(userKC => {
            if (!userKC) {
                error = new Error(`User with email ${email} not found`);
                userCallback(error);
                throw error;
            }
            createOrUpdateUser(userKC, userCallback);
            isLoggedDep.changed();
        });
};

Accounts.logoutKeycloak = (callback) => {
    checkCallbackFunction(callback);
    TecSinapseKeycloak.logout(getKeycloakService(), () => {
        Meteor.logout();
        isLoggedDep.changed();
        if (callback) {
            callback();
        }
    });
};