const {assert} = require('chai');
const {processTransaction} = require('../src/transaction');
const {passThroughOperation, asyncPassThroughOperation, numAttemptsFailOperation} = require('./utilities/operations');

describe('processTransaction', function() {

    it('should call all operations and return values for them', async function() {
        const result = await processTransaction((function*() {
            yield passThroughOperation(1);
            yield passThroughOperation(2);
            yield passThroughOperation(3);
        })());
        assert.equal(result[0].output, 1);
        assert.equal(result[1].output, 2);
        assert.equal(result[2].output, 3);
    });

    it('should work with async operations and return values for them', async function() {
        const result = await processTransaction((function*() {
            yield asyncPassThroughOperation(1);
            yield asyncPassThroughOperation(2);
            yield asyncPassThroughOperation(3);
        })());
        assert.equal(result[0].output, 1);
        assert.equal(result[1].output, 2);
        assert.equal(result[2].output, 3);
    });

    it('should retry failed transactions', async function() {
        const result = await processTransaction((function*() {
            yield asyncPassThroughOperation(1);
            // This should fail 3 times.
            yield numAttemptsFailOperation(2, {totalFails: 3});
        })());
        assert.equal(result[0].output, 1);
        assert.equal(result[1].output, 2);
        // We fail 3 times, the 4th time will succeed so we have 4 tries
        assert.equal(result[1].tries, 4);
    });

});