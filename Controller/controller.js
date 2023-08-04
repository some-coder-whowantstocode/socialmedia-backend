const { StatusCodes } = require('http-status-codes');
const User = require('../Model/usermodel');
const badrequest = require('../Error/badrequest');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const chatmodel = require('../Model/chatmodel');
const {uploadbase64stringtogridfs} = require('../utility/uploadprofilephoto')
const {getfromgrid} = require('../utility/getfromgrid');
const { deletefromgridfs } = require('../utility/deletefromgrid');

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
    console.log(req.body)
    const me = req.user.userId;
    const {friend} =req.body;
    if(!friend){

        throw new badrequest('no friend.')
    }
  
    const Friend = await User.updateOne({_id:friend},{
        $addToSet:{friends:new ObjectId(me)}
    },
    {new:true},
    function(error,success){
        if(error){
            console.log(error)
            throw new badrequest('some problem here')
        }else{

        }
    })
    //  await User.findById(friend);
    console.log(friend)
    if(!Friend){
        throw new badrequest('no such person.')
    }
   

    let user = await User.updateOne({_id:me},{
        $addToSet:{friends:new ObjectId(friend)}
    },
    {new:true},
    function(error,success){
        if(error){
            throw new badrequest('some problemm here')
        }else{
           
        }
    })

    let chat = await chatmodel.create({chatName:Friend.username,users:[friend,req.user.userId]})
    res.status(StatusCodes.OK).json({msg:`${Friend.username} has been added to friendlist.`,friend:Friend})
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

const addprofilephoto =async(req,res)=>{
    const {image,name} = req.body;
    if(!image || !name){
        throw new badrequest('please provide all required parameters.')
    }
    let uSer = await User.findById(req.user.userId)
    if(uSer.pic){
        console.log(uSer.pic)
        await deletefromgridfs(uSer.pic)
    }
    let gridid = await uploadbase64stringtogridfs(image,name);
    let user = await User.findOneAndUpdate({_id:req.user.userId},{pic:gridid},{new:true});
    
    res.status(StatusCodes.OK).json({user})
}

const getprofilephoto =async(req,res)=>{
    // console.log(req.user)
    const {id,name} = req.body;
    if(!id && !name){
        throw new badrequest('please provide id or name')
    }

    // let profile;
    if(id){
    var profile = await User.findById(id);
    // console.log(1)
    }else{
    var profile = await User.findOne({username :name});
   
    }
    
    if(profile.pic){
       
        let files = await getfromgrid(profile);

        // console.log(files)
       return  res.status(StatusCodes.OK).json(files)
    }else{
       
        res.status(StatusCodes.OK).json('no image')

    }
}


module.exports ={
    search,
    addfriend,
    allfriends,
    check,
    find,
    addprofilephoto,
    getprofilephoto
}