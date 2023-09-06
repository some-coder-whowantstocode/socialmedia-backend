const Chat = require('../Model/chatmodel')
const {badrequest} = require('../Error/errorhandler')
const {StatusCodes} = require('http-status-codes')
const Message = require('../Model/Messagemodel')
const User = require('../Model/usermodel')
const { ObjectId } = require('mongodb')

const createchat =async(req,res)=>{
    const {users} = req.body
    if(!users){
        throw new badrequest('some error in creating chat.')
    }
    const chat = await Chat.create({users})
   
res.status(StatusCodes.CREATED).json(chat)
    
}

const chatdetails = async(req,res)=>{
    const{id} = req.params;
    if(!id){
        throw new badrequest('no id given');
    }
    const chat = await Chat.findById(id);
    res.status(StatusCodes.OK).json(chat)
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
    let user = await User.findById(me)

    let chat = user.chats

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

const alreadychat = async (req, res) => {
    const { friend } = req.body;
    const me = req.user.userId;
    console.log(me, friend);

    let chat = await Chat.findOne({ users: { $all: [me, friend] } });
    if (chat) {
        return res.status(StatusCodes.OK).json({ chat });
    } else {
        const users = [friend, me];
        let newchat = await Chat.create({ users });
        // console.log(newchat)
        let promises = users.map((user) => {
            console.log(newchat._id);
            return User.updateOne(
                { _id: user },
                { $addToSet: { chats: new ObjectId(newchat._id) } },
                { new: true }
            );
        });

        await Promise.all(promises);

        res.status(StatusCodes.CREATED).json({ chat: newchat });
    }
};



module.exports ={
    createchat,
    deletechat,
    chatdetails,
    acceschat,
    getallmessages,
    alreadychat
}