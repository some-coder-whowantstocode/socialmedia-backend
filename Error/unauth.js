const customerr = require("./custom-err");
const {StatusCodes} = require('http-status-codes')

class UnauthenticatedError extends customerr{
    constructor(message){
        super(message,StatusCodes.UNAUTHORIZED)
    }
}

module.exports = UnauthenticatedError