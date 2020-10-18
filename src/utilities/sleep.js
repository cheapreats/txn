/**
 * Helper function that returns a promise that resolves in
 * milliseconds specified.
 * @param {!number} milliseconds 
 */
module.exports.sleep = function(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    })
};