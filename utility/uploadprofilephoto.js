const { MongoClient, GridFSBucket } = require("mongodb");


const uri = process.env.connecturl;
const dbname = 'profilephoto';


async function uploadbase64stringtogridfs(base64string,filename){
 

    const client = await MongoClient.connect(uri);
    const db = client.db(dbname);
  
    const bucket =  new GridFSBucket(db,{bucketName:'mycustombucket'});
  
    const decodedBuffer = Buffer.from(base64string,'base64');
    try{
     const file  = bucket.openUploadStream(filename)
     file.end(decodedBuffer)
     if(file){
     return file.id;
    }else{
      return false;
    }
    }catch(error){
      throw error
    }
  
   
    
  }


  module.exports = {
    uploadbase64stringtogridfs
  }