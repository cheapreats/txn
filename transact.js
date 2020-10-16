// javascript method to execute transactions, retry if they fail according
// to retryPolicy, and rollback if the entire transaction cannot succeed.
/**
 * @param generator {function*} - yield generator of transactions to execute
 */
function executeTransaction(generator) {
    let isSuccess  = true; // flag success/fail to return
    const executed = []; // table of transactions in case rollback is needed
    for (const operation of generator) {
        if (isSuccess == false) break; // stop if last transaction failed
        const numRetries = operation.retryPolicy.numRetries;
        try {
            var count = 0; // count of retries (not including first try)
            let execute = operation.execute.bind(operation);
            execute( count==numRetries ); // parameter indicating if last retry
            executed.unshift(operation); // push to front of the list
        } catch (e) {
            // execute failed, begin retry mechanism
            logMsg(e.message);
            const retry = operation.retry.bind(operation);
            while (count++ < numRetries) { // repeat until policy is exhausted
                try {
                    retry( count==numRetries ); // parameter indicating if last retry
                    executed.unshift(operation); // push to front of the list
                    break; // stop if retry succeeded
                } catch (e) {
                    // retry failed, check if this was last retry
                    logMsg(e.message);
                    if (count==numRetries ) { // rollback everything if last retry
                        for (const operation of executed) {
                            operation.rollback();
                        }
                        isSuccess = false; // transaction aborted
                        break;
                    }
                }
            }
        }
    }
    return isSuccess; // return to calling function whether transaction succeeded or failed
}


// javascript function to return object (consisting of methods execute,
// retry, rollback, calculate, and another object retryPolicy) necessary to
// calculate the order total.
/**
 * @param orderId {number} id of the order for which total is being calculated
 */
function calculateTotal(orderId) {
    return {
        // javascript function to execute total calculation.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        execute(isLast) {
            logMsg(`Attempting to calculate total for order ${orderId}... `);
            this.calculate(isLast);
        },

        // javascript function to retry the total calculation.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        retry(isLast) {
            pause(this.retryPolicy.delay);
            this.calculate(isLast);
        },

        // javascript function to rollback the total calculation.
        rollback() {
                logMsg(`Rolled back order ${orderId} total calculation.`);
        },

        // javascript object including numRetries and delay for retry mechanism.
        /**
         * @param numRetries {number} max number of retries allowed to be attempted
         * @param delay {number} delay in milliseconds between retries
         */
        retryPolicy: {
            numRetries: 2,
            delay: 1000,
        },

        // javascript function to actually perform the total calculation
        // called by both execute() and retry() functions above.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        calculate(isLast) {
            if ( module.exports.randomSuccess() == false ) {
                if (isLast) throw new Error('Failed.'); // final retry
                throw new Error('Failed... ');
            }
            logMsg('Succeeded.');
        }
    }
}


// javascript function to return object (consisting of methods execute,
// retry, rollback, calculate, and another object retryPolicy) necessary to
// update a coupon.
/**
 * @param couponNumber {number} id of the coupon being updated
 */
function updateCoupon(couponNumber) {
    return {
        // javascript function to execute coupon update.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        execute(isLast) {
            logMsg(`Attempting to update coupon ${couponNumber}... `);
            this.update(isLast);
        },

        // javascript function to retry the coupon update.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        retry(isLast) {
            pause(this.retryPolicy.delay);
            this.update(isLast);
        },

        // javascript function to rollback the coupon update.
        rollback: () => {
            logMsg(`Rolled back coupon ${couponNumber} update.`);
        },

        // javascript object including numRetries and delay for retry mechanism.
        /**
         * @param numRetries {number} max number of retries allowed to be attempted
         * @param delay {number} delay in milliseconds between retries
         */
        retryPolicy: {
            numRetries: 2,
            delay: 500,
        },

        // javascript function to actually perform the coupon update
        // called by both execute() and retry() functions above.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        update(isLast) {
            if ( module.exports.randomSuccess() == false ) {
                if (isLast) throw new Error('Failed.'); // final retry
                throw new Error('Failed... ');
            }
            logMsg('Succeeded.');
        }
    }
}


// javascript function to return object (consisting of methods execute,
// retry, rollback, calculate, and another object retryPolicy) necessary to
// charge the vendor fee.
function chargeVendorFee() {
    return {
        // javascript function to execute vendor fee charge.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        execute(isLast) {
            logMsg('Attempting to charge vendor fee... ');
            this.chargeVendor(isLast);
        },

        // javascript function to retry the vendor fee charge.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        retry(isLast) {
            pause(this.retryPolicy.delay);
            this.chargeVendor(isLast);
        },

        // javascript function to rollback the vendor fee charge.
        rollback() {
            logMsg('Rolled back vendor charge.');
        },

        // javascript object including numRetries and delay for retry mechanism.
        /**
         * @param numRetries {number} max number of retries allowed to be attempted
         * @param delay {number} delay in milliseconds between retries
         */
        retryPolicy: {
            numRetries: 2,
            delay: 500,
        },

        // javascript function to actually perform the vendor fee charge
        // called by both execute() and retry() functions above.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        chargeVendor(isLast) {
            if ( module.exports.randomSuccess() == false ) {
                if (isLast) throw new Error('Failed.'); // final retry
                throw new Error('Failed... ');
            }
            logMsg('Succeeded.');
        }
    }
}


// javascript function to return object (consisting of methods execute,
// retry, rollback, calculate, and another object retryPolicy) necessary to
// charge the customer's credit card.
/**
 * @param ccNumber {number} id of the credit card being charged
 */
function chargeCreditCard(ccNumber) {
    return {
        // javascript function to execute credit card charge.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        execute(isLast) {
            logMsg(`Charging credit card with ccNumber ${ccNumber}... `);
            this.chargeCreditCard(isLast);
        },

        // javascript function to retry the credit card charge.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        retry(isLast) {
            pause(this.retryPolicy.delay);
            this.chargeCreditCard(isLast);
        },

        // javascript function to rollback the credit card charge.
        rollback() {
            logMsg(`Rolled back credit card charge for ${ccNumber}.`);
        },

        // javascript object including numRetries and delay for retry mechanism.
        /**
         * @param numRetries {number} max number of retries allowed to be attempted
         * @param delay {number} delay in milliseconds between retries
         */
        retryPolicy: {
            numRetries: 2,
            delay: 500,
        },

        // javascript function to actually perform the credit card charge
        // called by both execute() and retry() functions above.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        chargeCreditCard(isLast) {
            if ( module.exports.randomSuccess() == false ) {
                if (isLast) throw new Error('Failed.'); // final retry
                throw new Error('Failed... ');
            }
            logMsg('Succeeded.');
        }
    }
}


// javascript function to return object (consisting of methods execute,
// retry, rollback, calculate, and another object retryPolicy) necessary to
// save the order.
/**
 * @param orderId {number} id of the order for which total is being calculated
 */
function saveOrder(orderId) {
    return {
        // javascript function to execute saving the order.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        execute(isLast) {
            logMsg(`Saving order ${orderId}... `);
            this.saveOrder(isLast);
        },

        // javascript function to retry saving the order.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        retry(isLast) {
            pause(this.retryPolicy.delay);
            this.saveOrder(isLast);
        },

        // javascript function to rollback saving the order.
        rollback() {
            logMsg(`Removing order ${orderId}.`);
        },

        // javascript object including numRetries and delay for retry mechanism.
        /**
         * @param numRetries {number} max number of retries allowed to be attempted
         * @param delay {number} delay in milliseconds between retries
         */
        retryPolicy: {
            numRetries: 2,
            delay: 500,
        },

        // javascript function to actually perform saving the order
        // called by both execute() and retry() functions above.
        /**
         * @param isLast {boolean} indicating if this is the last retry
         */
        saveOrder(isLast) {
            if ( module.exports.randomSuccess() == false ) {
                if (isLast) throw new Error('Failed.'); // final retry
                throw new Error('Failed... ');
            }
            logMsg('Succeeded.');
        }
    }
}


// javascript method to log a message to the console.
/**
 * @param msg {string} content of the message to be logged
 */
function logMsg(msg) {
    if ( (msg || "") == "") { console.log(); return; }
    if (msg.slice(-1) == " ") process.stdout.write(msg);
    else console.log(msg);
}


// javascript method to pause for a given period of milliseconds.
/**
 * @param milliseconds {number} - number of milliseconds to pause
 */
function pause(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


// javascript method to return an equal chance of true or false,
// representing success or failure respectively.
function randomSuccess() {
    return (Math.random() < .5);
}

module.exports = {executeTransaction, calculateTotal, updateCoupon,
    chargeVendorFee, chargeCreditCard, saveOrder,
    logMsg, randomSuccess};
