const express = require('express');
const router = express.Router();
const {
    adddev,
    removedev,
   banuser,
   unbanuser,
   suspenduser,
   devlogin,
} = require('../Controller/devcontroller')
const devautentication = require('../middleware/devautentication')

router.post('/adddev',adddev)
router.post('/removedev',removedev)
router.post('/devlogin',devlogin)
router.post('/banuser',devautentication,banuser)
router.post('/unbanuser',devautentication,unbanuser)
router.post('/suspenduser',devautentication,suspenduser)

module.exports = router

