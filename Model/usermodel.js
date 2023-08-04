const mongoose = require('mongoose')
const { hashpass } = require('../utility/hashpassword')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const customerr = require('../Error/custom-err')
const {StatusCodes} = require('http-status-codes')
const { ObjectId } = require('mongodb')



const userschema = new mongoose.Schema({
    Email:{
        type:String,
        match:[/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i],
        unique:[true,'emailid already exists.'],
    },
    username:{
        type:String,
        unique:[true,'username is already taken.']
    },
    salt:{
        type:String
    },
    password:{
        type:String,
        minlength:[6,"password must be longer than 6."]
    },
    isblocked:{
        type:Boolean,
        default:false
    },
    suspendexpires:{
        type:Date
    },
    issuspended:{
        type:Boolean,
        default:false
    },
    dob:{
        type:Date
    },
    friends:[{
        type:ObjectId,
        ref:'User'
    }],
    numberoffirends:{
        type:Number,
        default:0
    },
    pic:{
        type:ObjectId,
        ref:'User'
    }
})


userschema.pre('save',async function(next){
    try{
        this.salt = this.password.length
        this.password =await hashpass(this.password,this.salt);
        next();
    }catch(err){
        throw new customerr(err,StatusCodes.BAD_REQUEST)
    }
   
});



userschema.methods.createhass = async function(password){
    try{
        password =await hashpass(password,this.salt);
        return password;
    }catch(err){
        throw new customerr(err,StatusCodes.BAD_REQUEST)
    }

}


userschema.methods.createJWT = function(lt){
    try{
        return jwt.sign({userId:this._id,name:this.username},process.env.jwt_secret,{expiresIn:lt ? lt:process.env.jwt_lifetime})

    }catch(err){
        throw new customerr(err,StatusCodes.BAD_REQUEST)
    }

}


userschema.methods.comparepassword = async function(canditatepassword){
    try{
        const ismatch = await bcrypt.compare(canditatepassword,this.password)
        return ismatch
    }catch(err){
        throw new customerr(err,StatusCodes.BAD_REQUEST)
    }
  
}



module.exports = mongoose.model('user',userschema)
