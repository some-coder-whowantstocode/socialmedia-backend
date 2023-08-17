const { StatusCodes } = require('http-status-codes');
const badrequest = require('../Error/badrequest');
const Message = require('../Model/Messagemodel');
const chatmodel = require('../Model/chatmodel');

const sendmessage =async(req,res)=>{
    const {content,chat} = req.body
    if(!content || !chat){
        throw new badrequest('Invalid request.')
    }
    const {users} = await chatmodel.findById(chat);
    const sender = req.user.userId;
    const message = Message.create({sender,content,chat,users})
    res.status(StatusCodes.ACCEPTED).json('messege delivered.')
}

module.exports ={
    sendmessage
}