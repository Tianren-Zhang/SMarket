class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized', field, value, location = 'header') {
        super(message);
        this.name = "UnauthorizedError";
        this.status = 401;
        this.type = 'auth';
        this.field = field;
        this.value = value;
        this.location = location;
    }
}

module.exports = UnauthorizedError;