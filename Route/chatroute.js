const express = require('express');
const userauthentication = require('../middleware/userauthentication');
const {
     createchat,
     deletechat,
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


module.exports = router