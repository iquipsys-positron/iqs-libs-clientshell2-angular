# <img src="https://github.com/pip-webui/pip-webui/raw/master/doc/Logo.png" alt="Pip.WebUI Logo" style="max-width:30%"> <br/> Iqs Client Shell

![](https://img.shields.io/badge/license-MIT-blue.svg)


This module is released under [MIT license](License) and totally free for commercial and non-commercial use.

## Build

Build process has 2 steps:
1. You have to build a library to further use. Run
```bash
npm run package
```
This command will build a library. You can use local copy of this library or install latest version using `npm i @iquipsys/iqs-clients2-shell`.

2. You can run example now:
```bash
npm run start
```
or
```bash
ng serve
```

## Running unit tests

Important part of tests are designed for library. You can run library tests using command:
```bash
npm run test:lib
```
Tests for example application could be run using command:
```bash
npm run test
```

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).


## Services available (by features)

* `applications` feature:
  * `IqsApplicationsConfigService` - service to configure `applications` feature;
  * `IqsApplicationsDataService` - service to retrieve applications from server;
  * `IqsApplicationsService` - service to work with applications in application storage;
* `help` feature:
  * `IqsHelpPanelService` - service to configure current state of `IqsHelpPanel` component;
* `notifications` feature:
  * `IqsNotificationsPanelService` - service to configure current state of `IqsNotificationsPanel` component;
  * `IqsNotificationsDataService` - service to retrieve notifications from server;
  * `IqsNotificationsService` - service to work with notifications in application storage;
* `session` feature:
  * `IqsSessionConfigService` - service to configure `session` parts of the application;
  * `IqsSessionDataService` - service to retrieve session from server;
  * `IsqSessionService` - service to work with session in application storage;
  * `IqsUsersDataService` - **temporary** service to work with users. Will be deprecated in future and replaced;
* `settings` feature:
  * `IqsSettingsDataService` - service to work with user settings requests;
  * `IqsSettingsService` - service to work with user settings in application storage;
* `shell` feature`:
  * `IqsShellService` - service to configure shell behavior;
* `sites` feature:
  * `IqsSitesDataService` - service to retrieve sites list from server;
  * `IqsSitesService` - service to work with sites in application storage;