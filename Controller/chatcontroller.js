const Chat = require('../Model/chatmodel')
const {badrequest} = require('../Error/errorhandler')
const {StatusCodes} = require('http-status-codes')
const Messagemodel = require('../Model/Messagemodel')
const { ObjectId } = require('mongodb')

const createchat =async(req,res)=>{
    const {chatName,users} = req.body
    if(!chatName || !users){
        throw new badrequest('some error in creating chat.')
    }

    const chat = await Chat.create({chatName,users})
    res.status(StatusCodes.CREATED).json('chat created')
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
    let messages = await Messagemodel.find({chat:new ObjectId(chat)})

    res.status(StatusCodes.OK).json({messages})

}

module.exports ={
    createchat,
    acceschat,
    getallmessages
}