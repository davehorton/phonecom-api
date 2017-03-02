'use strict' ;

const ApiClient = require('..') ;
const argv = require('minimist')(process.argv.slice(2));
const assert = require('assert') ;

assert( argv.token, 'token is required') ;
assert( argv.accountId, 'accountId is required') ;
assert( argv.extensionId, 'extensionId is required') ;


let api = new ApiClient(argv.token) ;

api.getExtension( argv.accountId, argv.extensionId, (err, account) => {
  if( err ) {
    throw err ;
  }
  console.log(`${JSON.stringify(account, null, '  ')}`);
}) ;
