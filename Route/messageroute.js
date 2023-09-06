const express = require('express')
const { 
    sendmessage,
    deleteforme,
    deleteforeveryone,
    getmessage
} = require('../Controller/messagecontroller')
const userauthentication = require('../middleware/userauthentication')
const router = express.Router()


router.post('/sendmessage',userauthentication,sendmessage)
router.get('/deleteforme/:id',userauthentication,deleteforme)
router.post('/deleteforeveryone',userauthentication,deleteforeveryone)
router.get('/getmessage/:id',getmessage)

module.exports = router