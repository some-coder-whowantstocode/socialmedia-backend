const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const messagemodel = mongoose.Schema({
    sender:{
        type:ObjectId,
        ref:'User'
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:ObjectId,
        ref:'Chat'
    }
},
{
    timestamps:true
}
)


module.exports = mongoose.model('Message',messagemodel)