class AlreadyExistsError extends Error {
    constructor(message) {
        super(message);
        this.name = "AlreadyExistsError";
        // status code 409 Conflict is often used for this type of error
        this.status = 409;
    }
}

module.exports = AlreadyExistsError;
