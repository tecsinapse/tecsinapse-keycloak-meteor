import { Accounts } from 'meteor/accounts-base';
import { hasConfig, getKeycloakService, isLoggedDep, checkCallbackFunction } from './common.js'
import { ServiceConfiguration } from 'meteor/service-configuration';
import TecSinapseKeycloak from 'tecsinapse-keycloak-js';

const notEmpty = (value, fieldName) => {
    if (!value || (value === "string" && 0 === value.length)) {
        throw new Error(`${fieldName} must be a value`);
    }
};

function checkKeycloakConfigService(userCallback) {
    if (!hasConfig()) {
        var error = new ServiceConfiguration.ConfigError('keycloak');
    
        if (userCallback) {
            userCallback(error);
        }
        throw new Error(error);
    }
}
function checkEmailAndPassword(email, password, userCallback) {
    try {
        notEmpty(email, 'Email');
        notEmpty(password, 'Password');
    } catch(error) {
        if (userCallback) {
            userCallback(error);
        }
        throw error;
    }
}

Accounts.loginWithKeycloak = (email, password, userCallback) => {

    checkCallbackFunction(userCallback);
    checkKeycloakConfigService(userCallback);
    checkEmailAndPassword(email, password, userCallback);

    if (Accounts.isLogged()) {
        return;
    }

    TecSinapseKeycloak.config(getKeycloakService());

    TecSinapseKeycloak.login(email, password)
        .then(accessToken => Meteor.call('createOrUpdateUser', email, userCallback));
        
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