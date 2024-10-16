/**
 * Custom error class for indicating that too many requests have been sent by a single client in a given amount of time.
 * @extends Error
 */
class TooManyRequestsError extends Error {
  /**
   * Constructs a new TooManyRequestsError.
   * @param {string} message - The error message.
   * @param {string} [field=null] - Optional. The field related to the error, if applicable.
   * @param {any} [value=null] - Optional. The value associated with the field, if any, that may have triggered the rate limit.
   * @param {string} [location='network'] - The area where the error typically occurs, default is 'network' as
   *                                        it relates to the traffic and request handling.
   */
  constructor(message, field = null, value = null, location = 'network') {
    super(message);
    this.name = 'TooManyRequestsError';
    this.status = 429;
    this.field = field;
    this.value = value;
    this.location = location;
  }
}

module.exports = TooManyRequestsError;
