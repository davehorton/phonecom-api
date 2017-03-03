# phonecom-api
Phone.com API module for nodejs clients.  See phone.com [API documentation](https://apidocs.phone.com/docs) for details on the API.

### Example usage

#### Creating an api instance
Pass in your API token
```js
const ApiClient = require('phonecom-api') ;
var api = new ApiClient( api_token ) ;
```

#### Listing objects:
```js
api.listAccounts( (err, accounts) => {...}) ;

api.listExtensions( accountId, (err, extensions) => {...}) ;

api.listContacts( accountId, extensionId, (err, contacts) => {...}) ;

// etc...
```

#### Retrieving an object
```
api.getAccount( accountId, (err, account) => {...}) ;

api.getExtension( accountId, extensionId, (err, extension) => {...}) ;

api.getContact( accountId, extensionId, contactId, (err, contact) => {...}) ;

// etc...
```


