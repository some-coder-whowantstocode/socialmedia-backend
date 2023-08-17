// require('express-async-errors')
const express = require('express');
const { connect } = require('mongoose');
const app = express();
require('dotenv').config()
const userrouter = require('./Route/userroute')
const devrouter = require('./Route/devroute')
const chatrouter = require('./Route/chatroute')
const messagerouter = require('./Route/messageroute')
const bodyParser = require('body-parser');
const errorHandlerMiddleware = require('./middleware/error-handler');
// const userauthentication = require('./middleware/userauthentication')
const cors = require('cors');
const { Server } = require('socket.io');
require('ejs')
const http = require('http')

const server = http.createServer(app)
app.use(cors({
    origin: process.env.baseurl,
    methods:["GET","POST","PATCH","DELETE"]
  }))


  app.use(express.json({limit: '10mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Port = process.env.port||3000;
const connecturl = process.env.connecturl
app.set('view engine','ejs')


const start =async()=>{
    try{
        await connect(connecturl);
        server.listen(Port,()=>console.log('app is listining...',Port))


    }catch(err){
        console.error('Error connecting to MongoDB:', err);
    }
   
}


app.use('/socialmedia/api/v1/',userrouter)
app.use('/socialmedia/api/v1/',devrouter)
app.use('/socialmedia/api/v1/',chatrouter)
app.use('/socialmedia/api/v1/',messagerouter)


app.get('/',(req,res)=>{
    res.send('hi')
})



const io = new Server(server,{
    cors:{
        origin:process.env.baseurl,
        methods:['GET','POST','DELETE']
    }
})

io.on('connection',(socket)=>{
    // console.log(`user connected : ${socket.id}`)

    socket.on("send_message",(data)=>{
        
        socket.broadcast.emit('receive_message',data)
    })
})


start()

app.use(errorHandlerMiddleware)