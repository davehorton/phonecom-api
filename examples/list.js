const ApiClient = require('..') ;
const argv = require('minimist')(process.argv.slice(2));
const assert = require('assert') ;

assert(argv.token, 'token is required') ;
assert(argv.objectType, 'objectType is required') ;
assert(argv.accountId, 'accountId is required') ;

const api = new ApiClient(argv.token) ;

let fn ;
switch (argv.objectType) {
  case 'Accounts': fn = api.listAccounts.bind(api, {fields: 'brief'}) ; break ;
  case 'Extensions': fn = api.listExtensions.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'Applications': fn = api.listApplications.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'CallLogs': fn = api.listCallLogs.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'Devices': fn = api.listDevices.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'Listeners': fn = api.listListeners.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'ExpressServiceCodes': fn = api.listExpressServiceCodes.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'CallerIds': fn = api.listCallerIds.bind(api, argv.accountId, argv.extensionId, {fields: 'brief'}); break ;
  case 'Contacts': fn = api.listContacts.bind(api, argv.accountId, argv.extensionId, {fields: 'brief'}); break ;
  case 'Groups': fn = api.listGroups.bind(api, argv.accountId, argv.extensionId, {fields: 'brief'}); break ;
  case 'Media': fn = api.listMedia.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'Menus': fn = api.listMenus.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'PhoneNumbers': fn = api.listPhoneNumbers.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'Routes': fn = api.listRoutes.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'Queues': fn = api.listQueues.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'Schedules': fn = api.listSchedules.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'Sms': fn = api.listSms.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'Subaccounts': fn = api.listSubaccounts.bind(api, argv.accountId, {fields: 'brief'}); break ;
  case 'Trunks': fn = api.listTrunks.bind(api, argv.accountId, {fields: 'brief'}); break ;

  default:
    assert(false, `unknown objectType ${argv.objectType}`);
}

fn((err, data) => {
  if (err) throw err ;
  console.log(`${JSON.stringify(data, null, '  ')}`);
}) ;
