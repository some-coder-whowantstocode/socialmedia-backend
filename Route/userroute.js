const express = require('express');
const router = express.Router();
const {
    register, 
    login,
    forgotpassword,
    forgot_password,
    changepassword,
    deleteaccount,
    checkifexist,
    changeforgottenpassword,
} = require('../Controller/usercontroller');
const { 
    search, 
    addfriend,
    allfriends,
    check,
    find,
    addprofilephoto,
    getprofilephoto,
    removefriend
 } = require('../Controller/controller');
const userauthentication = require('../middleware/userauthentication');


router.post('/register',register)
router.post('/checkifexist',checkifexist)
router.post('/login',login)
router.post('/forgotpassword',forgotpassword)
router.get('/forgot-password/:id/:token',forgot_password)
router.post('/forgottenpassword',changeforgottenpassword)
router.put('/changepassword',changepassword)
router.delete('/deleteaccount',deleteaccount)
router.get('/search/:username',search)
router.get('/friends/:id',allfriends)
router.get('/auth/:token',check)
router.post('/addfriend',userauthentication,addfriend)
router.get('/find/:id',find)
router.post('/addprofilephoto',userauthentication,addprofilephoto)
router.post('/getprofilephoto',getprofilephoto)
router.post('/removefriend',userauthentication,removefriend)


module.exports = router
