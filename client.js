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

Accounts.loginWithKeycloak = async function(email, password, userCallback) {

    checkCallbackFunction(userCallback);
    checkKeycloakConfigService(userCallback);
    checkEmailAndPassword(email, password, userCallback);

    if (await Accounts.isLogged()) {
        return;
    }
    TecSinapseKeycloak.config(getKeycloakService());

    try {
        await TecSinapseKeycloak.login(email, password);
    }catch(e){
        if (e !== 'You are already logged in') {
            if(userCallback) {
                userCallback(e)
            }
            return;
        }
    }
    const user = Meteor.call("getUserInfo", email, function(err, user){
        if(err && userCallback) {
            userCallback(err);
        }
        Accounts.callLoginMethod({
            methodArguments: [user],
            userCallback
        });
    });
};

Accounts.logoutKeycloak = (callback) => {
    checkCallbackFunction(callback);
    TecSinapseKeycloak.config(getKeycloakService());
    TecSinapseKeycloak.getToken().then((token) => {
        Meteor.call("logoutKeycloak", token.session_state, function(err){
            Meteor.logout();
            isLoggedDep.changed();
            TecSinapseKeycloak.removeToken(callback);
        });
    })
    .catch(error => {
        if (callback) {
            callback(error);
        }
    });
};