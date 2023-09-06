const { StatusCodes } = require('http-status-codes');
const badrequest = require('../Error/badrequest');
const Message = require('../Model/Messagemodel');
const Chat = require('../Model/chatmodel');
const User = require('../Model/usermodel')
const { ObjectId } = require('mongodb');


const getmessage = async(req,res)=>{
    const {id} = req.params;
    if(!id)
    {
        throw badrequest('no chatid.');
    }
    const message = await Message.findById(id);

    res.status(StatusCodes.OK).json(message)
}


const sendmessage =async(req,res)=>{
    const {content,chat} = req.body
    if(!content || !chat){
        throw new badrequest('Invalid request.')
    }
    const {users} = await Chat.findById(chat);
    const sender = req.user.userId;
    const message =await  Message.create({sender,content,chat,users})
    await Chat.updateOne({_id:chat},{latestmessage:new ObjectId(message._id)})
    // console.log(message)
    // let a= users.map((user)=>{
    //     console.log(user)
    //     let a= User.findById(user).then(data=>console.log(data))
    //     User.updateOne(
    //         { _id: user },
    //         { $pull: { chats: new ObjectId(chat) }, $push: { 

    //             arrayField: {
    //                 $each: [element],
    //                 $position: 0
    //               }
    //         } }
    //       );
    // })

    // Promise.all(a)
    // .then(()=>res.status(StatusCodes.ACCEPTED).json(message))
    // .catch((err)=>{throw badrequest(err)})
    

    res.status(StatusCodes.ACCEPTED).json(message)

    
}

const deleteforeveryone = async(req,res)=>{
    const {messageid} = req.body;

    if(!messageid)
    {
        throw new badrequest('No messageid.');
    }

    const msg = await Message.findByIdAndDelete(messageid);

    res.status(StatusCodes.OK).json('message deleted for everyone.');


}

const deleteforme = async(req,res)=>{
    const {id} = req.params;

    if(!id)
    {
        throw new badrequest('No messageid.');
    }

    
    let a =await Message.updateOne({_id:new ObjectId(id)},{ $pull: { users: new ObjectId(req.user.userId) } })

    let msg = await Message.findById(id);
    console.log(a)

    res.status(StatusCodes.OK).json({msg});


}

module.exports ={
    sendmessage,
    deleteforeveryone,
    deleteforme,
    getmessage
}