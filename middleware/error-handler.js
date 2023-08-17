const {customerr} = require('../Error/errorhandler');
const  {StatusCodes} = require('http-status-codes')

function errorHandlerMiddleware(err, req, res, next){
    if (err instanceof customerr) {
     return res.status(err.statusCode).json({ msg: err.message })
    }
    else{
        if(err.code===11000){
           return res.status(StatusCodes.BAD_REQUEST).send({ message: 'User already exists.' });
        }
        if (err.name === 'ValidationError' && err.errors.devid && err.errors.devid.kind === 'enum') {
         return res.status(StatusCodes.BAD_REQUEST).send({ error: `Invalid value for devid.` });
       } 
       if (err.statusCode === 413) {
               return res.status(StatusCodes.REQUEST_TOO_LONG).send('Request too large');
             }
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json( err.message )
    }
  }
  
  module.exports = errorHandlerMiddleware