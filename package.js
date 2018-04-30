Npm.depends({
  'tecsinapse-keycloak-js': '1.0.14'
});

Package.describe({
  name: 'tecsinapse:keycloak-meteor',
  version: '0.0.5',
  summary: 'Keycloak login integrated with Accounts',
  git: 'https://github.com/tecsinapse/tecsinapse-keycloak-meteor.git',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom('1.4');
  api.use('ecmascript');
  api.use('service-configuration@1.0.11');
  api.use('accounts-base');
  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});
