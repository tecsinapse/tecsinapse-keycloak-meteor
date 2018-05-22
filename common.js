import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Accounts } from 'meteor/accounts-base';
import { ServiceConfiguration } from 'meteor/service-configuration';
import TecSinapseKeycloak from 'tecsinapse-keycloak-js';

export const isLoggedDep = new Tracker.Dependency;

Accounts.isLogged = async () => {
    isLoggedDep.depend();
    if(Meteor.server){
        return !!Accounts.user();
    }
    TecSinapseKeycloak.config(getKeycloakService());
    const isLogged = await TecSinapseKeycloak.isLogged();
    return isLogged && !!Accounts.user();
};

export const SERVICE_NAME = 'keycloak';
export const hasConfig = () => ServiceConfiguration.configurations.findOne({service: SERVICE_NAME});
export const getKeycloakService = () => ServiceConfiguration.configurations.findOne({service: SERVICE_NAME});
export const checkCallbackFunction = (callback) => {
    if (callback && typeof callback !== 'function') {
        throw new Error(`Callback ${callback} is not a function`);
    }
};