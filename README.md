# txn

Flexible transaction management. Learn more about it in our [blog post](https://blog.cheapreats.com/handling-transactions-at-cheapreats/).

You can find a nice demo [here](https://repl.it/@junzhengca/cheapreatstxn-Demo#index.js).

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
        retryPolicy: {
            count: 3,
            delay: 1000,
        }
    }
}
```

Above definition will simply create an user upon execute, and delete the user
when rolling back. Retry policy is set to retry maximum 3 times, with delay
between being 1000ms.

Now you can define a transaction, a transaction is simply a generator function
that yields operations. Here we assume you also have `createIdentity`,
`sendVerificationEmail`, and `chargeMembershipFee` defined.

```javascript
function* signup(username, password, email, creditCard) {
    yield createUser(username, password);
    yield createIdentity(username, password);
    const verificationCode = getVerificationCode(email);
    yield sendVerificationEmail(email);
    yield chargeMembershipFee(creditCard);
}
```

Now you have a transaction defined, you can run it by wrapping it with `txn`.

```javascript
const {txn} = require('@cheapreats/txn');

txn(signup('jun.zheng', 'test', 'jun.zheng@cheapreats.com', {/** ... */}))
    .then(result => {
        console.log(result);
        // process result here.
    })
```

`txn` method will resolve to `null` if transaction failed, otherwise it will
give you an array with the following contents:

```javascript
[
    {
        output: {}, // Output value for ith operation
        tries: 10 // Number of times tried.
    },
    // ...
]
```

If a rollback failed, then an error will be raised, you must handle that
accordingly, usually we send a critical alert to admins.

----------------------------------------------------------------

Build with ❤️ at Cheapreats