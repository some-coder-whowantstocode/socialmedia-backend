const Dev = require('../Model/devmodel')
const jwt = require('jsonwebtoken')
const {badrequest} = require('../Error/errorhandler')
const { StatusCodes } = require('http-status-codes')

const devauthentication = async(req,res,next)=>{
    try{

    const authheader = req.headers.authorization
    if(!authheader || !authheader.startsWith('Bearer')){
        throw new Error('Authontication failed')
    }


    const token = await authheader.split(' ')[1]
    try{
        const payload = jwt.verify(token,process.env.jwt_secret)
        req.user = {devId:payload._id,name:payload.name,devid:payload.role}
        next()
    }catch(error){
        throw new badrequest('Authontication faild',401)
    }
}catch(err){
    throw new badrequest(err,StatusCodes.BAD_REQUEST)
}

}

module.exports = devauthentication