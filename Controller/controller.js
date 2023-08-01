const { StatusCodes } = require('http-status-codes');
const User = require('../Model/usermodel');
const badrequest = require('../Error/badrequest');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const chatmodel = require('../Model/chatmodel');

const search =async(req,res)=>{
    const {username} = req.params;
    const obj ={}
    
    if(username){
        obj.username = {$regex:username,$options:'i'}
    }

    let user = await User.find(obj)

    res.status(StatusCodes.OK).json(user)
}

const addfriend = async(req,res)=>{
    // console.log(req.body)
    const me = req.user.userId;
    const {friend} =req.body;
    if(!friend){
        throw new badrequest('no friend.')
    }
  
    let Friend = await User.findById(friend);
    if(!Friend){
        throw new badrequest('no such person.')
    }
   

    let user = await User.updateOne({_id:me},{
        $addToSet:{friends:new ObjectId(friend)}
    },
    {new:true},
    function(error,success){
        if(error){
            throw new badrequest(error)
        }else{
           
        }
    })
    let chat = await chatmodel.create({chatName:Friend.username,users:[Friend._id,req.user.userId]})
    res.status(StatusCodes.OK).json(`${Friend.username} has been added to friendlist.`)
}


const allfriends=async(req,res)=>{
    let {id} = req.params;
    if(!id){
        throw new badrequest('no id.')
    }
    const user = await User.findById(id);
    let {friends} = user
        res.status(StatusCodes.OK).json(friends)
    
}

const check =async(req,res)=>{
    const {token} = req.params
    const authheader = token
    if(!authheader || !authheader.startsWith('Bearer')){
        // console.log('here')
        throw new badrequest(' failed')
    }


    const toke = await authheader.split(' ')[1]
    try{
        const payload = jwt.verify(toke,process.env.jwt_secret)
        let user = {userId:payload.userId,name:payload.name}
        res.status(StatusCodes.OK).json(user)
    }catch(error){
        throw new badrequest('faild')
    }
}


const find=async(req,res)=>{
    const {id} = req.params

    // console.log(id)
    if(!id){
        throw new badrequest('no id')
    }
    let sendid = new ObjectId(id)
    let user = await User.findById(sendid);

    res.status(StatusCodes.OK).json(user)
}

module.exports ={
    search,
    addfriend,
    allfriends,
    check,
    find
}