const customerr = require("./custom-err");
const {StatusCodes} = require('http-status-codes')

class Notfound extends customerr{
    constructor(message){
        super(message,StatusCodes.NOT_FOUND)
    }
}

module.exports = Notfound