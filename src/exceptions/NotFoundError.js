/**
 * Custom error class for indicating that a resource was not found.
 * @extends Error
 */
class NotFoundError extends Error {
  /**
   * Constructs a new NotFoundError.
   * @param {string} message - The error message.
   * @param {string} field - The field that was not found.
   * @param {string} value - The value of the field that was not found.
   * @param {string} [location='params'] - The location of the error (default is 'params').
   */
  constructor(message, field, value, location = 'params') {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
    this.type = 'NotFoundError';
    this.field = field;
    this.value = value;
    this.location = location;
  }
}

module.exports = NotFoundError;
