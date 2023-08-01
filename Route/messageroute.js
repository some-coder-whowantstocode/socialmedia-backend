const express = require('express')
const { sendmessage } = require('../Controller/messagecontroller')
const userauthentication = require('../middleware/userauthentication')
const router = express.Router()


router.post('/sendmessage',userauthentication,sendmessage)


module.exports = router