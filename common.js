import { ServiceConfiguration } from 'meteor/service-configuration';

export const SERVICE_NAME = 'keycloak';
export const hasConfig = () => ServiceConfiguration.configurations.findOne({service: SERVICE_NAME});
export const getKeycloakService = () => ServiceConfiguration.configurations.findOne({service: SERVICE_NAME});