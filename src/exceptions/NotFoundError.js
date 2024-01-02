class NotFoundError extends Error {
    constructor(message, field, value, location = "params") {
        super(message);
        this.name = "NotFoundError";
        this.status = 404;
        this.type = "NotFoundError";
        this.field = field;
        this.value = value;
        this.location = location;
    }
}

module.exports = NotFoundError;
