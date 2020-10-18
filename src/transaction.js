const {sleep} = require('./utilities/sleep');

/**
 * Process a transaction, returns null if transaction failed, otherwise returns
 * a list of returned values from execute() function in operations yielded.
 * If this method throws an error then something went wrong while doing
 * 
 * @param {!any} generator 
 */
module.exports.processTransaction = async function(generator) {
    const executed = [];
    const result = [];

    for (const operation of generator) {
        let tryExecution = true;
        let currentRetryCount = 0;
        const maxRetryCount = operation.retryPolicy.count;
        const retryDelay = operation.retryPolicy.delay;
        while (tryExecution) {
            try {
                currentRetryCount++;
                const returnValue = await operation.execute();
                result.push({
                    output: returnValue,
                    tries: currentRetryCount,
                });
                executed.unshift(operation);
                tryExecution = false;
            } catch (e) {
                // Reached maximum retry count, stop trying execution for
                // this operation and proceed with rollback.
                if (currentRetryCount === maxRetryCount) {
                    tryExecution = false;
                    await rollback(executed);
                    return null;
                } else {
                    await sleep(retryDelay);
                }
            }
        }
    }

    return result;
}

/**
 * Rollback a list of operations.
 * @param {!any[]} operations 
 */
async function rollback(operations) {
    for (const operation of operations) {
        await operation.rollback();
    }
}
