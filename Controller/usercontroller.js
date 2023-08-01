const User = require('../Model/usermodel')
const {StatusCodes} = require('http-status-codes')
const {
    badrequest,
    customerr,
    UnauthenticatedError,
    Notfound
} = require('../Error/errorhandler');
const { hashpass } = require('../utility/hashpassword');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')


const register =async(req,res)=>{
    const {Email,username,password,dob} = req.body;
    if(!Email||!username||!password || !dob){
       throw new badrequest('Please provide all required parameters.');
    };
    if(password.length<6){
       throw new customerr('Password must be longer than 6.',500);

    };
    // let date = new Date(dob)
   let user = await User.create({Email,username,password,dob});
   let token = await user.createJWT();
    res.status(StatusCodes.CREATED).json({name:user.username,jwttoken:token});
}

const login = async(req,res)=>{
    const {Email,password} = req.body;
    if(!Email||!password){
        throw new badrequest('Please provide all the required parameters.')
    }
    const user = await User.findOne({Email})

    if(!user){
        throw new UnauthenticatedError('Invalid credentials')
    }

    const ispasswordcorrect = await user.comparepassword(password)

    if(!ispasswordcorrect){
        throw new UnauthenticatedError('Invalid credentials')
    }

    const token = await user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.username},token})

}



const forgotpassword =async(req,res)=>{
    const {Email,username} = req.body;
    if(!Email||!username){
        throw new badrequest('Please provide all the required parameters.');
    };
    let check = await User.findOne({Email});
    if(!check){
        throw new Notfound('Invalid emailid.');
    };
    if(check.username === username){
        throw new Notfound('Invalid username.');
    }
    let id = check._id;
    const token = await check.createJWT('15min');

    const link = `${process.env.link}socialmedia/api/v1/forgot-password/${id}/${token}`


    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.youremail,
            pass: process.env.yourpassword
        }
    });

    const info = await transporter.sendMail({
        from: '"Rohit" <socialmedia@dev.com>',
        to: Email, // list of receivers
        subject: "Change Password", // Subject line
        text: "follow the link to change your password", // plain text body
        html: `<a href=${link}>Click here</a>`, // html body
      })
  
    //   console.log("Message sent: %s", info.messageId);


    res.status(StatusCodes.ACCEPTED).json({link})
    
}


const changepassword =async(req,res)=>{
    const {Email,username,password,newpassword} = req.body;
    
    if(!Email ||!username||!newpassword||!password){
        throw new badrequest('Please provide all the required parameters.');
    };
    
    let check =await User.findOne({Email})
    if(!check){
        throw new Notfound('Invalid emailid.');
    };
    if(check.username === username){
        throw new Notfound('Invalid username.');
    }
    let issame = await check.comparepassword(password)
    if(!issame){
        throw new customerr('Invalid password.',StatusCodes.INTERNAL_SERVER_ERROR);
    }
    let isnew = await check.comparepassword(newpassword)
    if(isnew){
        throw new customerr('You cannot use same password again.',StatusCodes.INTERNAL_SERVER_ERROR);
    }
    let np = await hashpass(newpassword,check.salt)
    let user = username ? await User.findOneAndUpdate({username},{password:np},{new:true}) :await User.findOneAndUpdate({Email},{password:np},{new:true})
  
    let token = await user.createJWT();
    res.status(StatusCodes.MOVED_TEMPORARILY).json({name:user.username,token:token})
}


const deleteaccount =async(req,res)=>{
    const{Email,username,password} = req.body;
    if(!Email || !username||!password){
        throw new badrequest('Please provide all the required parameters.');
    };
    let user = await User.findOne({Email}) 
    if(!user){
        throw new badrequest('Invalid Email.');
    }
    if(user.username === username){
        throw new Notfound('Invalid username.');
    }
    let issame = await user.comparepassword(password);
    if(!issame){
        throw new badrequest('Wrong password.');
    }
    res.status(StatusCodes.OK).json({msg:"Succesfully deleted user."})
}

const checkifexist =async(req,res)=>{
    const {Email,username,password} = req.body;
    if(!Email||!username||!password){
       throw new badrequest('Please provide all required parameters.');
    };
    if(password.length<6){
       throw new customerr('Password must be longer than 6.',500);

    };
    let usernameexists = await User.findOne({username})
    if(usernameexists){
        throw new badrequest('username already exists please choose another.')
       }

    let emailexists = await User.findOne({Email})
   if(emailexists){  
    throw new badrequest('Email already exists.')
   }
  
    res.status(StatusCodes.CREATED).json({detail:'clean'});
}
const forgot_password = async(req,res)=>{
    const {id,token}=req.params;
    const payload =  jwt.verify(token,process.env.jwt_secret)
      let user = {userId:payload.userId,name:payload.name}
      let find = await User.findById(id)
      if(find.username == user.name){
        res.render('forgot-password')
      }else{
        res.send('no')
      }
}

const changeforgottenpassword = async(req,res)=>{
   const {username,newpassword,repeatnewpassword} = req.body;
   if(!username || !newpassword || !repeatnewpassword){
    throw new badrequest('please provide all required password.')
   }
   let uSer = await User.findOne({username});
   let pass = await uSer.createhass(newpassword)
   const user = await User.findOneAndUpdate({username},{password:pass},{new:true});
   
   if(!user){
    throw new badrequest('No such user exists.')
   }else{
   
   }
    res.status(StatusCodes.OK).send('password changed succesfully.')

}

module.exports = {
    register,
    login,
    forgotpassword,
    forgot_password,
    changepassword,
    deleteaccount,
    checkifexist,
    changeforgottenpassword
}

