'use strict'; 

const assert = require('assert') ;
const request = require('request') ;
const schemas = require('./schemas') ;
const util = require('util') ;

//require('request-debug')(request);

class ApiClient {

  constructor( token, baseUrl ) {
    assert( typeof token === 'string', 'you must provide a phone.com api token to the constructor') ;
    
    this.token = token ;
    this.request  = request.defaults({
      baseUrl: baseUrl || 'https://api.phone.com/v4/',
      json: true,
      strictSSL: true,
      auth: {
        bearer: token
      }
    }) ;
  }

  createListener( accountId, eventType, opts, callback ) {
    this.request.post('/' + accountId + '/listeners', {
      body: {
        type: 'callback',
        event_type: eventType,
        callbacks: typeof opts === 'object' ? opts : [{
          url: opts,
          role: 'main',
          verb: 'POST'          
        }] 
      }
    }, (err, response, body) => {
      if( err ) {
        return callback(err) ;
      }

      if( 201 !== response.statusCode ) {
        return callback( new Error(response.statusCode));
      }
      callback(null, body.id) ;
    });
  }

  removeListener( accountId, listenerId, callback ) {
    this.request.delete( '/' + accountId + '/listeners/' + listenerId, (err, response) => {
      if( err ) { return callback(err); }
      callback(null, response) ;
    }); 
  }

  list(url, params, callback) {
    this.request.get(url,  {
      qs: params, 
      useQuerystring: true
    }, (err, response, body) => {  
      if( err ||  200 !== response.statusCode ) {
        return callback(err);
      }
      callback(null, body ) ;
    }) ;
  }

  get(url, params, callback) {
    this.request.get(url,   {
      qs: params, 
      useQuerystring: true
    }, (err, response, body) => {  
      if( err ||  200 !== response.statusCode ) {
        return callback(err);
      }
      callback(null, body ) ;
    }) ;
  }
}

// add listXXX and getXXX methods for every object type
Object.keys( schemas ).forEach( (key) => {
  let schema = schemas[key] ;

  ApiClient.prototype['list' + key] = function( ...args) {
    let opts = normalizeParams( 'list', schema,  ...args ) ;
    this.list( opts.url, opts.params, opts.callback ) ;
  } ;

  let singular = key ;
  if( 's' === key[key.length-1] && 'Sms' !== key ) {
    singular = key.slice(0, key.length - 1) ;
  }
  ApiClient.prototype['get' + singular] = function( ...args) {
    let opts = normalizeParams( 'get', schema,  ...args ) ;
    this.get( opts.url, opts.params, opts.callback ) ;
  };
}) ;


function normalizeParams( method, schema, ...args ) {
  let count = args.length ;
  let identifierCount = count - 1 ;

  assert( typeof args[count-1] === 'function', 'callback function must be passed as last parameter') ;
  assert( identifierCount <= 3, 'too many args') ;

  let opts = {
    callback: args[count-1],
    params: {}
  } ;

  // we may have a params object just before the callback
  if( count > 1 && typeof args[count-2] === 'object' ) {
    opts.params = args[count-2] ;
    identifierCount-- ;
  }

  let ids = args.slice( 0, identifierCount) ;

  if( 'list' === method ) {
    opts.url = util.format( schema, ...ids) ;
  }
  else {
    let objectId = ids.pop() ;
    opts.url = util.format( schema, ...ids)  + '/' + objectId ;
  }

  console.log(`opts: ${JSON.stringify(opts)}`) ;
  return opts ;
}

module.exports = ApiClient ;