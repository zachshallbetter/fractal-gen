/**
 * Core Service Result Interface.
 *
 * @typedef {Object} CoreServiceResult
 * @property {boolean} success - Indicates if the operation was successful.
 * @property {string} message - A descriptive message.
 * @property {any} data - The data returned from the service.
 * @since 1.0.1
 */
function CoreServiceResult(success, message, data) {
    return {
        success,
        message,
        data,
    };
}
