import { Accounts } from 'meteor/accounts-base';
import { EJSON } from 'meteor/ejson'
import { ServiceConfiguration } from 'meteor/service-configuration';
import { SERVICE_NAME } from './common.js'

Accounts.keycloakConfig = (config) => {
    let jsonConfig = config;

    if (typeof config === "string") {
        jsonConfig = EJSON.parse(config);
    }
    ServiceConfiguration.configurations.upsert(
        {service: SERVICE_NAME},
        {$set: jsonConfig}
    );
};

Accounts.registerLoginHandler(SERVICE_NAME, (options) => {
    return Accounts.updateOrCreateUserFromExternalService(SERVICE_NAME, options);
});