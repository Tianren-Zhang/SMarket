const errorHandler = (err, req, res, next) => {
    // Check if the error is a known custom error
    if (err.status && err.type) {
        return res.status(err.status).json({
            errors: [{
                type: err.type,
                value: err.value,
                msg: err.message,
                path: err.field,
                location: err.location
            }]
        });
    }

    // Generic error fallback
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({message});
};

module.exports = errorHandler;
