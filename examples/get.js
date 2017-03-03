'use strict';

const ApiClient = require('..') ;
const argv = require('minimist')(process.argv.slice(2));
const assert = require('assert') ;

assert( argv.token, 'token is required') ;
assert( argv.objectType, 'objectType is required') ;
assert( argv.objectId, 'objectId is required') ;

let api = new ApiClient(argv.token) ;

let fn ;
switch( argv.objectType ) {
  case 'Accounts': fn = api.getAccount.bind(api, argv.objectId) ; break ;
  case 'Extensions': fn = api.getExtension.bind(api, argv.accountId, argv.objectId); break ;
  case 'Applications': fn = api.getApplication.bind(api, argv.accountId, argv.objectId); break ;
  case 'CallLogs': fn = api.getCallLog.bind(api, argv.accountId, argv.objectId); break ;
  case 'Devices': fn = api.getDevice.bind(api, argv.accountId, argv.objectId); break ;
  case 'Listeners': fn = api.getListener.bind(api, argv.accountId, argv.objectId); break ;
  case 'ExpressServiceCodes': fn = api.getExpressServiceCode.bind(api, argv.accountId, argv.objectId); break ;
  case 'CallerIds': fn = api.getCallerIds.bind(api, argv.accountId, argv.extensionId, argv.objectId); break ;
  case 'Contacts': fn = api.getContact.bind(api, argv.accountId, argv.extensionId, argv.objectId); break ;
  case 'Groups': fn = api.getGroup.bind(api, argv.accountId, argv.extensionId, argv.objectId); break ;
  case 'Media': fn = api.getMedia.bind(api, argv.accountId, argv.objectId); break ;
  case 'Menus': fn = api.getMenu.bind(api, argv.accountId, argv.objectId); break ;
  case 'PhoneNumbers': fn = api.getPhoneNumber.bind(api, argv.accountId, argv.objectId); break ;
  case 'Routes': fn = api.getRoute.bind(api, argv.accountId, argv.objectId); break ;
  case 'Queues': fn = api.getQueue.bind(api, argv.accountId, argv.objectId); break ;
  case 'Schedules': fn = api.getSchedule.bind(api, argv.accountId, argv.objectId); break ;
  case 'Sms': fn = api.getSms.bind(api, argv.accountId, argv.objectId); break ;
  case 'Subaccounts': fn = api.getSubaccounts.bind(api, argv.accountId, argv.objectId); break ;
  case 'Trunks': fn = api.getTrunks.bind(api, argv.accountId, argv.objectId); break ;


  default:
    assert(false, `unknown objectType ${argv.objectType}`);
}



fn( (err, data) => {
  if( err ) {
    throw err ;
  }
  console.log(`${JSON.stringify(data, null, '  ')}`);
}) ;
