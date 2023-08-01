const mongoose = require('mongoose')
const { hashpass } = require('../utility/hashpassword')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const customerr = require('../Error/custom-err')
const {StatusCodes} = require('http-status-codes')



const devschema = new mongoose.Schema({
    devemail:{
        type:String,
        match:[/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i],
        unique:[true,'emailid already exists'],
    },
    name:{
        type:String,
    },
    devid:{
        type: String,
        enum: ['admin', 'moderator'],
        unique: true
    },
    salt:{
        type:String
    },
    devpass:{
        type:String
    }
})



devschema.pre('save',async function(next){
    try{
        this.salt = this.devid.length
        this.devpass =await hashpass(this.devpass,this.salt);
        next();
    }catch(err){
        throw new customerr(err,StatusCodes.BAD_REQUEST)
    }
   
});



devschema.methods.comparedevpass = async function(devpassword){
    try{
        const ismatch = await bcrypt.compare(devpassword,this.devpass)
        return ismatch
    }catch(err){
        throw new customerr(err,StatusCodes.BAD_REQUEST)
    }
  
}


devschema.methods.createJWT = function(){
    try{
        return jwt.sign({devId:this._id,name:this.name,role:this.devid},process.env.jwt_secret,{expiresIn:process.env.jwt_lifetime})

    }catch(err){
        throw new customerr(err,StatusCodes.BAD_REQUEST)
    }

}



module.exports = mongoose.model('dev',devschema)


