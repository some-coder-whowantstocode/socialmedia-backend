const { StatusCodes } = require('http-status-codes');
const badrequest = require('../Error/badrequest');
const Message = require('../Model/Messagemodel')

const sendmessage =async(req,res)=>{
    const {content,chat} = req.body
    if(!content || !chat){
        throw new badrequest('Invalid request.')
    }
    const sender = req.user.userId;
    const message = Message.create({sender,content,chat})
    res.status(StatusCodes.ACCEPTED).json('messege delivered.')
}

module.exports ={
    sendmessage
}