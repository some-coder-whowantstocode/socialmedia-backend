const bcrypt = require('bcryptjs');
const customerr = require('../Error/custom-err');

async function hashpass(password,saltstring){
    try{
        const salt = await bcrypt.genSalt(Number(saltstring));
        let pass = await bcrypt.hash(password,salt);
        return pass
    }catch(err){
        throw new customerr(err,500)
    }
   
}

module.exports = {hashpass}