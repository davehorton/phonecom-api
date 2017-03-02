'use strict' ;

const ApiClient = require('..') ;
const argv = require('minimist')(process.argv.slice(2));
const assert = require('assert') ;

assert( argv.token, 'token is required') ;


let api = new ApiClient(argv.token) ;

api.listAccounts( (err, accounts) => {
  if( err ) {
    throw err ;
  }
  console.log(`${JSON.stringify(accounts, null, '  ')}`);
}) ;
