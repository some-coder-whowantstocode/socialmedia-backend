const User = require('../Model/usermodel')
const Dev = require('../Model/devmodel')
const {StatusCodes} = require('http-status-codes')
const {
    badrequest,
    customerr,
    UnauthenticatedError,
    Notfound
} = require('../Error/errorhandler');


const adddev =async(req,res)=>{
    const{devemail,name,devid,devpass} = req.body;
    if(!devemail || !name || !devid || !devpass){
        throw new badrequest('please provide all parameter.');
    }
    let dev = await Dev.create({devemail,name,devid,devpass});

    let token = await dev.createJWT()

    res.status(StatusCodes.CREATED).json({name:dev.name,token:token})
}

const devlogin = async(req,res)=>{
    const{devemail,devid,devpass} = req.body;

    if(!devemail || !devid || !devpass){
        throw new badrequest('please provide all parameter.');
    }
    
    let dev = await Dev.findOne({devemail,devid});

    let issame = dev.comparedevpass(devpass)
    if(!issame){
        throw new badrequest('invalid password.');
    }

    let token = await dev.createJWT()

    res.status(StatusCodes.CREATED).json({name:dev.name,token:token})
}

const removedev = async(req,res)=>{
    const{devemail,name,devid,devpass} = req.body;
    if(!devemail || !name || !devid || !devpass){
        throw new badrequest('please provide all parameter.');
    }
    let dev = await Dev.findOne({devemail,devid});
    if(!dev){
        throw new UnauthenticatedError('Invalid credentials')
    }
    let issame = await dev.comparedevpass(devpass)
    let sameid = (dev.devid ==devid);

    if(!issame || !sameid){
        throw new UnauthenticatedError('Invalid credentials')
    }

    let remove = await Dev.findOneAndDelete({devemail,devid})

    res.status(StatusCodes.CREATED).json({msg:"Succesfully deleted."})
}


const banuser =async(req,res)=>{
   const {devemail,devid,Email}=req.body;
   if(!devemail||!devid||!Email){
    throw new badrequest('please provide all parameter.')
   }
   let dev = await Dev.findOne({devemail,devid});
   if(!dev){
    throw new UnauthenticatedError('No such developer.')
   }
   let user = await User.findOneAndUpdate({Email},{isblocked:true},{new:true});

   res.status(StatusCodes.OK).json({msg:`User ${user.username} succesfully banned.`})
}



const unbanuser =async(req,res)=>{
    const {devemail,devid,Email}=req.body;
    if(!devemail||!devid||!Email){
     throw new badrequest('please provide all parameter.')
    }
    let dev = await Dev.findOne({devemail,devid});
    if(!dev){
     throw new UnauthenticatedError('No such developer.')
    }
    let user = await User.findOneAndUpdate({Email},{isblocked:false},{new:true});
 
    res.status(StatusCodes.OK).json({msg:`User ${user.username} succesfully unbanned.`})
 }
 

const suspenduser = async(req,res)=>{
    const {devemail,devid,Email}=req.body;
    if(!devemail||!devid||!Email){
     throw new badrequest('please provide all parameter.')
    }
    let dev = await Dev.findOne({devemail,devid});
    if(!dev){
     throw new UnauthenticatedError('No such developer.')
    }const banExpires = new Date();
    let user = await User.findOneAndUpdate({Email},{issuspended:true,suspendexpires:banExpires.setDate(banExpires.getDate() + days)},{new:true});
 
    res.send(StatusCodes.OK).json({msg:`User ${user.username} succesfully suspended.`})
}

const checkInterval = 60 * 60 * 1000; 

async function checkBans() {
  const usersToUnban = await User.find({ suspendexpires: { $lte: new Date() } });

  for (const user of usersToUnban) {
    user.issuspended = false;
    user.suspendexpires = null;
    await user.save();
  }

  setTimeout(checkBans, checkInterval);
}

checkBans();

module.exports = {
    adddev,
    devlogin,
    removedev,
    banuser,
    unbanuser,
    suspenduser
}

