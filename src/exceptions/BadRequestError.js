class BadRequestError extends Error {
    constructor(message, field, value, location = 'body') {
        super(message);
        this.name = "BadRequestError";
        this.status = 400;
        this.type = 'validation';
        this.field = field;
        this.value = value;
        this.location = location;
    }
}