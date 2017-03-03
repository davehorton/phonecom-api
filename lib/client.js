'use strict'; 

const assert = require('assert') ;
const request = require('request') ;
const schemas = require('./schemas') ;
const util = require('util') ;

require('request-debug')(request);

class ApiClient {

  constructor( token ) {
    assert( typeof token === 'string', 'you must provide a phone.com api token to the constructor') ;
    
    this.token = token ;
    this.request  = request.defaults({
      baseUrl: 'https://api.phone.com/v4/',
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
        console.error(`error registering with phone.com for call events: ${JSON.stringify(err)}`) ;
        return callback(err) ;
      }

      if( 201 !== response.statusCode ) {
        console.error(`error registering with phone.com for call events: ${JSON.stringify(response.statusCode)}`) ;
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

  listListeners( accountId, callback ) {
    this.request.get( '/' + accountId + '/listeners/',  (err, response, body) => {  
      if( err ||  200 !== response.statusCode ) {
        return callback(err);
      }
      callback(null, body ) ;
    }) ;
  }

  list(url, callback) {
    this.request.get(url,  (err, response, body) => {  
      if( err ||  200 !== response.statusCode ) {
        return callback(err);
      }
      callback(null, body ) ;
    }) ;
  }

  get(url, callback) {
    this.request.get(url,  (err, response, body) => {  
      if( err ||  200 !== response.statusCode ) {
        return callback(err);
      }
      callback(null, body ) ;
    }) ;
  }
}

Object.keys( schemas ).forEach( (key) => {
  let schema = schemas[key] ;

  // add 'listXXX' methods
  ApiClient.prototype['list' + key] = function(accountId, otherId, callback) {
    let url = util.format(schema, accountId, otherId);  
    if( typeof otherId === 'function') {
      callback = otherId ;
      url = util.format(schema, accountId);       
    }
    else if( typeof accountId === 'function') {
      callback = accountId ;
      url = schema ;
    }

    this.list( url, callback ) ;
  } ;

  // add 'getXXXX' methods
  let singular = key ;
  if( 's' === key[key.length-1] ) {
    singular = key.slice(0, key.length - 1) ;
  }
  ApiClient.prototype['get' + singular] = function(accountId, otherId, objectId, callback) {
    let url = util.format(schema, accountId, otherId) + '/' + objectId ;
    if( typeof objectId === 'function') {
      callback = objectId ;
      objectId = otherId ;
      url = util.format(schema, accountId) + '/' + objectId ;
    }
    if( typeof otherId === 'function') {
      callback = otherId ;
      objectId = accountId ;
      url = schema + '/' + objectId;       
    }
    this.get( url, callback ) ;
  };

}) ;


module.exports = ApiClient ;