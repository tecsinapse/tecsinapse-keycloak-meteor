import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base';
import { ServiceConfiguration } from 'meteor/service-configuration';
import TecSinapseKeycloak from 'tecsinapse-keycloak-js';

Accounts.isLogged = () => {
    return TecSinapseKeycloak.isLogged() && Accounts.user();
};

export const SERVICE_NAME = 'keycloak';
export const hasConfig = () => ServiceConfiguration.configurations.findOne({service: SERVICE_NAME});
export const getKeycloakService = () => ServiceConfiguration.configurations.findOne({service: SERVICE_NAME});