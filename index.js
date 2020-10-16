// Test mechanism necessary for repl.it.
// Uncomment to run testing on repl.it.
/*
const mocha = require('mocha')
const chai = require('chai')
const sinon = require('sinon')
const runner = new mocha({})
runner.addFile('./test/test.js')
runner.run(failures => {
    if (failures) {
        console.error(failures)
    } else {
        console.log('All passed.')
    }
})
*/

const transact = require('./transact.js');
module.exports = {placeOrder};

// javascript generator of each sequential step to process a transaction.
function *placeOrder() {
    let orderId = Math.floor( Math.random()*5000 );
    yield transact.calculateTotal(orderId);

    let couponNumber = Math.floor( Math.random()*5000 );
    yield transact.updateCoupon(couponNumber);

    yield transact.chargeVendorFee();

    let ccNumber = Math.floor( Math.random()*5000 );
    yield transact.chargeCreditCard(ccNumber);

    yield transact.saveOrder(orderId);
}

// Transaction Management main routine.
transact.logMsg("Transaction Management\n");

transact.logMsg("Transaction Finished: Succeed = " + transact.executeTransaction( placeOrder() ));
