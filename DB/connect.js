const mongoose = require('mongoose')
const customerr = require('../Error/custom-err')

const connect =(url)=>{
    try{
        return mongoose.connect(url,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 60000,
            socketTimeoutMS: 60000
        })
    }catch(error){
        throw new customerr(error,500)
    }
  
}

module.exports ={connect}