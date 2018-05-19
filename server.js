import { Accounts } from 'meteor/accounts-base';
import { EJSON } from 'meteor/ejson'
import { ServiceConfiguration } from 'meteor/service-configuration';
import { SERVICE_NAME, isLoggedDep } from './common.js'
import TecSinapseKeycloak from 'tecsinapse-keycloak-js';
import fetch from "node-fetch";
import {getKeycloakService} from "./common";

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


Accounts.registerLoginHandler(SERVICE_NAME, function(user){

    const r = Accounts.updateOrCreateUserFromExternalService(SERVICE_NAME, user);
    isLoggedDep.changed();
    return r;
});

Meteor.methods({
    async getUserInfo(email){
        const userKC = await TecSinapseKeycloak.getUser(email);
        const roles = await TecSinapseKeycloak.getRoles(userKC.id);

        let user = {
            id: userKC.id,
            username: userKC.username,
            firstName: userKC.firstName,
            email: userKC.email,
            enabled: userKC.enabled
        };
        user.roles = roles;
        return user;
    },
    async logoutKeycloak(token){
        await TecSinapseKeycloak.logoutWithoutRemoveToken(token);
    }
});