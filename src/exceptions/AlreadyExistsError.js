class AlreadyExistsError extends Error {
    constructor(message, field, value, location = 'body') {
        super(message);
        this.name = "AlreadyExistsError";
        this.status = 409;
        this.type = 'conflict';
        this.field = field; // For AlreadyExistsError, field is likely mandatory
        this.value = value;
        this.location = location;
    }
}

module.exports = AlreadyExistsError;
