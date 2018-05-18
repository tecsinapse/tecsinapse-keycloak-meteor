import { Accounts } from 'meteor/accounts-base';
import { EJSON } from 'meteor/ejson'
import { ServiceConfiguration } from 'meteor/service-configuration';
import { SERVICE_NAME } from './common.js'
import TecSinapseKeycloak from 'tecsinapse-keycloak-js';
import fetch from "node-fetch";

Accounts.keycloakConfig = (config) => {
    let jsonConfig = config;

    if (typeof config === "string") {
        jsonConfig = EJSON.parse(config);
    }

    const { realm, clientId, urlServer } = jsonConfig;

    ServiceConfiguration.configurations.upsert(
        {service: SERVICE_NAME},
        {$set: { realm, clientId, urlServer }}
    );

    TecSinapseKeycloak.config({ ...jsonConfig, fetcher: fetch });
};

const createOrUpdateUser = (userKC, userCallback) => {
    let user = {
        id: userKC.id,
        username: userKC.username,
        firstName: userKC.firstName,
        email: userKC.email,
        enabled: userKC.enabled
    };

    TecSinapseKeycloak.getRoles(user.id)
        .then(roles => {
            user.roles = roles;
            Accounts.callLoginMethod({
                methodArguments: [user],
                userCallback
            });
        });
};

Accounts.registerLoginHandler(SERVICE_NAME, (options) => {
    return Accounts.updateOrCreateUserFromExternalService(SERVICE_NAME, options);
});

Meteor.methods({
    async createOrUpdateUser(email, userCallback) {
        await TecSinapseKeycloak.getUser(email)
        .then(userKC => {
            if (!userKC) {
                error = new Error(`User with email ${email} not found`);
                if (userCallback) {
                    userCallback(error);
                }
                throw error;
            }
            createOrUpdateUser(userKC, userCallback);
            isLoggedDep.changed();
        })
        .catch(error => {
            if (userCallback) {
                userCallback(error);
            }
            throw error;
        });
    }
})