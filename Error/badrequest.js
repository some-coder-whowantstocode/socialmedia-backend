const customerr = require("./custom-err");
const {StatusCodes} = require('http-status-codes')

class badrequest extends customerr{
    constructor(message){
        super(message,StatusCodes.BAD_REQUEST);
    }
}


module.exports = badrequest