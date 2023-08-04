const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");
const customerr = require("../Error/custom-err");


const uri = process.env.connecturl;
const dbname = 'profilephoto';


async function deletefromgridfs(id){
 

    const client = await MongoClient.connect(uri);
    const db = client.db(dbname);
  
    const bucket =  new GridFSBucket(db,{bucketName:'mycustombucket'});
  
    try{
        await bucket.delete(new ObjectId(id))
        
        return true;
    }catch(error){
        throw new customerr(error,500)
    }

   
   
    
  }


  module.exports = {
    deletefromgridfs
  }