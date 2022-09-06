const CustomError = require('./custom-error');

class UnauthenticatedError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }
}

module.exports = UnauthenticatedError;