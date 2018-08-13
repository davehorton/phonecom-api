const assert = require('assert') ;
const request = require('request') ;
const schemas = require('./schemas') ;
const util = require('util') ;
const clearRequire = require('clear-require');
require('request-debug')(request);

class ApiClient {

  constructor(token, baseUrl) {
    assert(typeof token === 'string', 'you must provide a phone.com api token to the constructor') ;

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

  set debug(enabled) {
    if (enabled) require('request-debug')(request);
    else {
      clearRequire('request-debug');
    }
  }

  createCall(accountId, opts, callback) {

    const __x = (callback) => {
      this.request.post(`/accounts/${accountId}/calls`, {
        body: opts
      }, (err, response, body) => {
        if (err) return callback(err);
        if (201 !== response.statusCode) {
          console.error(`createCall response was : ${JSON.stringify(response)}`);
          console.error(`body was: ${JSON.stringify(body)}`);
          return callback(new Error(response.statusCode));
        }
        callback(null, body.id) ;
      });
    };

    if (callback) {
      __x(callback) ;
      return this ;
    }

    return new Promise((resolve, reject) => {
      __x((err, ...args) => {
        if (err) return reject(err);
        resolve(...args);
      });
    });
  }

  createListener(accountId, eventType, opts, callback) {
    if (typeof opts === 'string') {
      opts = [{
        url: opts,
        role: 'main',
        verb: 'POST'
      }] ;
    }
    else if (typeof opts === 'object' && !Array.isArray(opts)) {
      opts = [opts] ;
    }

    const __x = (callback) => {

      this.request.post(`/accounts/${accountId}/listeners`, {
        body: {
          type: 'callback',
          event_type: eventType,
          callbacks: opts
        }
      }, (err, response, body) => {
        if (err) {
          console.error(`response: ${response}`);
          console.error(`body: ${JSON.stringify(body)}`);
          return callback(err) ;
        }

        if (201 !== response.statusCode) {
          console.error(`response was : ${JSON.stringify(response)}`);
          console.error(`body was: ${JSON.stringify(body)}`);
          return callback(new Error(response.statusCode));
        }
        callback(null, body.id) ;
      });
    };

    if (callback) {
      __x(callback) ;
      return this ;
    }

    return new Promise((resolve, reject) => {
      __x((err, ...args) => {
        if (err) return reject(err);
        resolve(...args);
      });
    });
  }

  removeListener(accountId, listenerId, callback) {
    const __x = (callback) => {
      this.request.delete(`/accounts/${accountId}/listeners/${listenerId}`, (err, response) => {
        if (err) return callback(err);
        callback(null, response) ;
      });
    };

    if (callback) {
      __x(callback) ;
      return this ;
    }

    return new Promise((resolve, reject) => {
      __x((err, ...args) => {
        if (err) return reject(err);
        resolve(...args);
      });
    });
  }

  list(url, params, callback) {

    const __x = (callback) => {
      this.request.get(url,  {
        qs: params,
        useQuerystring: true
      }, (err, response, body) => {
        const error = packageError(err, response, body) ;
        if (error) { return callback(error); }

        callback(null, body) ;
      }) ;
    };

    if (callback) {
      __x(callback) ;
      return this ;
    }

    return new Promise((resolve, reject) => {
      __x((err, ...args) => {
        if (err) return reject(err);
        resolve(...args);
      });
    });
  }

  get(url, params, callback) {
    const __x = (callback) => {
      this.request.get(url,   {
        qs: params,
        useQuerystring: true
      }, (err, response, body) => {
        const error = packageError(err, response, body) ;
        if (error) return callback(error);

        callback(null, body) ;
      }) ;
    };

    if (callback) {
      __x(callback) ;
      return this ;
    }

    return new Promise((resolve, reject) => {
      __x((err, ...args) => {
        if (err) return reject(err);
        resolve(...args);
      });
    });
  }
}

// add listXXX and getXXX methods for every object type
Object.keys(schemas).forEach((key) => {
  const schema = schemas[key] ;

  ApiClient.prototype['list' + key] = function(...args) {
    const opts = normalizeParams('list', schema,  ...args) ;
    return this.list(opts.url, opts.params, opts.callback) ;
  } ;

  let singular = key ;
  if ('s' === key[key.length - 1] && 'Sms' !== key) {
    singular = key.slice(0, key.length - 1) ;
  }
  ApiClient.prototype['get' + singular] = function(...args) {
    const opts = normalizeParams('get', schema,  ...args) ;
    return this.get(opts.url, opts.params, opts.callback) ;
  };
}) ;


function normalizeParams(method, schema, ...args) {
  let count = args.length ;
  const hasCallback = typeof args[count - 1] === 'function';

  const opts = {
    params: {}
  } ;
  if (hasCallback) opts.callback = args.pop();

  count = args.length ;

  // we may have a params object just before the callback
  if (count > 0 && typeof args[count - 1] === 'object') {
    opts.params = args.pop() ;
    count-- ;
  }

  const ids = args.slice(0) ;

  if ('list' === method) {
    opts.url = ids.length > 0 ? util.format(schema, ...ids) : schema;
  }
  else {
    const objectId = ids.pop() ;
    opts.url = util.format(schema, ...ids)  + '/' + objectId ;
  }

  return opts ;
}

module.exports = ApiClient ;

function packageError(err, response, body) {
  if (err) return err;
  if (response.statusCode === 401) {
    let error ;
    if (body.error && body.error_description) {
      error = new Error(body.error_description) ;
      error.name = body.error ;
    }
    else {
      error = new Error(response.statusCode) ;
    }
    return error ;
  }
}
