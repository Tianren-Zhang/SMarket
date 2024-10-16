/**
 * Custom error class for indicating that a request is unauthorized.
 * @extends Error
 */
class UnauthorizedError extends Error {
  /**
   * Constructs a new UnauthorizedError.
   * @param {string} message - The error message.
   * @param {string} field - The field that is invalid.
   * @param {string} value - The value of the field that is invalid.
   * @param {string} [location='header'] - The location of the error (default is 'header').
   */
  constructor(message = 'Unauthorized', field, value, location = 'header') {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
    this.type = 'auth';
    this.field = field;
    this.value = value;
    this.location = location;
  }
}

module.exports = UnauthorizedError;
