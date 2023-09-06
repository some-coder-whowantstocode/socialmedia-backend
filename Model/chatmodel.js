const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')


const chatmodel = mongoose.Schema(
    {
        chatName:{
            type:String,
            trim:true
        },
        isGroupchat:{
            type:Boolean,
            default:false
        },
        users:[{
            type:ObjectId,
            ref:'User'
        }],
        latestmessage:{
            type:ObjectId,
            ref:'Message',
            default:null
        },
        groupAdmin:{
            type:ObjectId,
            ref:'User',
            default:null
        },
      
    },
    {
        timestamps:true
    }
)


module.exports = mongoose.model('Chat',chatmodel);