const customerr = require('./custom-err')
const badrequest = require('./badrequest')
const  UnauthenticatedError = require('./unauth')
const Notfound = require('./notfound')

module.exports={
    customerr,
    badrequest,
    UnauthenticatedError,
    Notfound
}