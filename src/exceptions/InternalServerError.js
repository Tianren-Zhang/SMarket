/**
 * Class representing an internal server error.
 * Typically used when an unexpected condition was encountered and no more specific message is suitable.
 *
 * @extends Error
 */
class InternalServerError extends Error {
  /**
   * Creates an InternalServerError.
   * @param {string} message - The error message.
   * @param {string} [location='server'] - Indicates where the error occurred within the application.
   */
  constructor(message, location = 'server') {
    super(message);
    this.name = 'InternalServerError';
    this.status = 500;
    this.type = 'internal_server_error';
    this.location = location;
  }
}

module.exports = InternalServerError;
