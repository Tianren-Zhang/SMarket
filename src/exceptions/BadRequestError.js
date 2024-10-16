/**
 * Custom error class for indicating that a request is invalid.
 * @extends Error
 */
class BadRequestError extends Error {
  /**
   * Constructs a new BadRequestError.
   * @param {string} message - The error message.
   * @param {string} field - The field that is invalid.
   * @param {string} value - The value of the field that is invalid.
   * @param {string} [location='body'] - The location of the error (default is 'body').
   */
  constructor(message, field, value, location = 'body') {
    super(message);
    this.name = 'BadRequestError';
    this.status = 400;
    this.type = 'validation';
    this.field = field;
    this.value = value;
    this.location = location;
  }
}

module.exports = BadRequestError;
