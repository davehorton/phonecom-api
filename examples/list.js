'use strict';

const ApiClient = require('..') ;
const argv = require('minimist')(process.argv.slice(2));
const assert = require('assert') ;

assert( argv.token, 'token is required') ;
assert( argv.objectType, 'objectType is required') ;
assert( argv.accountId, 'accountId is required') ;

let api = new ApiClient(argv.token) ;

let fn ;
switch( argv.objectType ) {
  case 'Accounts': fn = api.listAccounts.bind(api) ; break ;
  case 'Extensions': fn = api.listExtensions.bind(api, argv.accountId); break ;
  case 'Applications': fn = api.listApplications.bind(api, argv.accountId); break ;
  case 'CallLogs': fn = api.listCallLogs.bind(api, argv.accountId); break ;
  case 'Devices': fn = api.listDevices.bind(api, argv.accountId); break ;
  case 'Listeners': fn = api.listListeners.bind(api, argv.accountId); break ;
  case 'ExpressServiceCodes': fn = api.listExpressServiceCodes.bind(api, argv.accountId); break ;
  case 'CallerIds': fn = api.listCallerIds.bind(api, argv.accountId, argv.extensionId); break ;
  case 'Contacts': fn = api.listContacts.bind(api, argv.accountId, argv.extensionId); break ;
  case 'Groups': fn = api.listGroups.bind(api, argv.accountId, argv.extensionId); break ;
  case 'Media': fn = api.listMedia.bind(api, argv.accountId); break ;
  case 'Menus': fn = api.listMenus.bind(api, argv.accountId); break ;
  case 'PhoneNumbers': fn = api.listPhoneNumbers.bind(api, argv.accountId); break ;
  case 'Routes': fn = api.listRoutes.bind(api, argv.accountId); break ;
  case 'Queues': fn = api.listQueues.bind(api, argv.accountId); break ;
  case 'Schedules': fn = api.listSchedules.bind(api, argv.accountId); break ;
  case 'Sms': fn = api.listSms.bind(api, argv.accountId); break ;
  case 'Subaccounts': fn = api.listSubaccounts.bind(api, argv.accountId); break ;
  case 'Trunks': fn = api.listTrunks.bind(api, argv.accountId); break ;


  default:
    assert(false, `unknown objectType ${argv.objectType}`);
}



fn( (err, data) => {
  if( err ) {
    throw err ;
  }
  console.log(`${JSON.stringify(data, null, '  ')}`);
}) ;
