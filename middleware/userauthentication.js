
const badrequest = require('../Error/badrequest')
const User = require('../Model/usermodel')
const jwt = require('jsonwebtoken')

const userauthentication = async(req,res,next)=>{
    console.log(req.headers.authorization)
    const authheader = req.headers.authorization
    console.log(authheader)
    if(!authheader || !authheader.startsWith('Bearer')){
        console.log('here')
        throw new badrequest('Authontication failed')
    }


    const token = await authheader.split(' ')[1]
    try{
        const payload = jwt.verify(token,process.env.jwt_secret)
        req.user = {userId:payload.userId,name:payload.name}
        console.log(payload)

        next()
    }catch(error){
        console.log('here too')
        throw new badrequest('token expired')
    }

}

module.exports = userauthentication