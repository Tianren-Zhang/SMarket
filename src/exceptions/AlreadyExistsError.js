/**
 * Custom error class for indicating that a resource already exists.
 * @extends Error
 */
class AlreadyExistsError extends Error {
  /**
   * Constructs a new AlreadyExistsError.
   * @param {string} message - The error message.
   * @param {string} field - The field that already exists.
   * @param {string} value - The value of the field that already exists.
   * @param {string} [location='body'] - The location of the error (default is 'body').
   */
  constructor(message, field, value, location = 'body') {
    super(message);
    this.name = 'AlreadyExistsError';
    this.status = 409;
    this.type = 'conflict';
    this.field = field; // For AlreadyExistsError, field is likely mandatory
    this.value = value;
    this.location = location;
  }
}

module.exports = AlreadyExistsError;
