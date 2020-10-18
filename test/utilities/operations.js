/**
 * Given a value, simply return it upon execution.
 * @param {!any} value 
 */
module.exports.passThroughOperation = function(value) {
    return {
        execute: () => {
            return value;
        },
        rollback: () => {
            // doesn't do anything.
        },
        // Doesn't really matter.
        retryPolicy: {
            numRetries: 1,
            delay: 1000,
        }
    }
}

/**
 * Same as passThroughOperation but async.
 * @param {!any} value 
 */
module.exports.asyncPassThroughOperation = function(value) {
    return {
        execute: async () => {
            return value;
        },
        rollback: async () => {
            // doesn't do anything.
        },
        // Doesn't really matter.
        retryPolicy: {
            count: 1,
            delay: 1000,
        }
    }
}

module.exports.numAttemptsFailOperation = function(value, {totalFails}) {
    this._fails = 0;
    this._rollbacks = 0;
    return {
        execute: async () => {
            if (this._fails < totalFails) {
                this._fails++;
                throw new Error('Failure #' + this._fails);
            }
            return value;
        },
        rollback: async () => {
            // Doesn't do anything
        },
        retryPolicy: {
            count: 10,
            delay: 100,
        }
    }
}