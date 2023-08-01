const express = require('express');
const userauthentication = require('../middleware/userauthentication');
const { createchat, acceschat, getallmessages } = require('../Controller/chatcontroller');

const router = express.Router();

router.post('/chat',userauthentication,createchat)
router.get('/getchat',userauthentication,acceschat)
router.get('/allmessages/:chat',userauthentication,getallmessages)


module.exports = router