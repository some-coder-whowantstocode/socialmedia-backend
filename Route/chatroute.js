const express = require('express');
const userauthentication = require('../middleware/userauthentication');
const {
     createchat,
     deletechat,
     chatdetails,
      acceschat, 
      getallmessages,
      alreadychat, 
     
     } = require('../Controller/chatcontroller');

const router = express.Router();

router.post('/chat',userauthentication,createchat)
router.post('/deletechat',userauthentication,deletechat)
router.get('/getchat',userauthentication,acceschat)
router.get('/allmessages/:chat',userauthentication,getallmessages)
router.post('/chatwithfriend',userauthentication,alreadychat)
router.get('/getchatdetails/:id',userauthentication,chatdetails)


module.exports = router