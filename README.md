# txn

Flexible transaction management. Learn more about it in our [blog post](https://blog.cheapreats.com/handling-transactions-at-cheapreats/).

## Install

```
$ npm install @cheapreats/txn --save
```

## Quick Start

Before creating a transaction, you must first define all the operations that
can be rolled back. For example you might do something like this:

```javascript
const User = require('./models/User');

function createUser(username, password) {
    let user = null;
    return {
        execute: () => {
            user = new User({username, password});
            await user.save();
        },
        rollback: () => {
            await user.delete();
        },
        retryPolicies: {
            count: 3,
            delay: 1000,
        }
    }
}
```

Above definition will simply create an user upon execute, and delete the user
when rolling back. Retry policy is set to retry maximum 3 times, with delay
between being 1000ms.
