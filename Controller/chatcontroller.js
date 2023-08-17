const Chat = require('../Model/chatmodel')
const {badrequest} = require('../Error/errorhandler')
const {StatusCodes} = require('http-status-codes')
const Message = require('../Model/Messagemodel')
const { ObjectId } = require('mongodb')

const createchat =async(req,res)=>{
    const {users} = req.body
    if(!users){
        throw new badrequest('some error in creating chat.')
    }

    const chat = await Chat.create({users})
    res.status(StatusCodes.CREATED).json('chat created')
}

const deletechat = async(req,res)=>{
    const {id} = req.body;
    if(!id){
        throw new badrequest('check the request body.');
    }
    await Message.updateMany({chat:new ObjectId(id)},{ $pull: { users: req.user.userId } })



    res.status(StatusCodes.OK).json('chat deleted successfully.');
}

const acceschat =async(req,res)=>{
    let me = req.user.userId;
    let chat = await Chat.find({users:me})

    res.status(StatusCodes.OK).json({chat})

}

const getallmessages = async(req,res)=>{
    const {chat} = req.params;
    if(!chat){
        throw new badrequest('no chat?')
    }
    // console.log(req.user.userId)
    let messages = await Message.find({chat:chat, users: { $elemMatch:{$eq: req.user.userId}} })

    res.status(StatusCodes.OK).json({messages})

}

const alreadychat = async(req,res)=>{
    const {friend} = req.body;
    const me = req.user.userId;
    
    let chat = await Chat.find({users:{$all: [me, friend]}});
    if(chat.length >0 ){
        res.status(StatusCodes.OK).json({chat})
        // console.log(chat)
    }else{
        const users = [friend,me]
        let newchat = await Chat.create({users})
        res.status(StatusCodes.CREATED).json({newchat})
    }
}

module.exports ={
    createchat,
    deletechat,
    acceschat,
    getallmessages,
    alreadychat
}