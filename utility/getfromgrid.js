require('express-async-errors')
const { badrequest,customerr } = require("../Error/errorhandler");
const { GridFSBucket, MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const { ObjectId } = require('mongodb');
const { stringmodifier } = require("./stringmodifier");

const uri = process.env.connecturl;
const dbname = 'profilephoto';


async function getfromgrid(item){

  
    try{

        const client = await MongoClient.connect(uri);
        const db = client.db(dbname);
    
        const bucket =  new GridFSBucket(db,{bucketName:'mycustombucket'});
       
       
        const downloadstream = bucket.openDownloadStream(new ObjectId(item.pic))
        let buffer = Buffer.alloc(0);
        downloadstream.on('error',(error)=>{
            console.log(error)
        })
        let res = await new Promise((resolve,reject)=>{
            downloadstream.on('data',(chunk)=>{
                buffer = Buffer.concat([buffer,chunk]);
            });
            downloadstream.on('error',reject);
            downloadstream.on('end',()=>resolve(buffer))
        })

        let files={};
        try{
            files.chunk = await stringmodifier( res.toString('base64'));
        }catch(error){
            console.log(error)
        }

        return files
        // // const file = items.map((item)=>{
        //      bucket.find({_id:new ObjectId(item.pic)}).toArray();
        // // })
        // let files =await Promise.all(file)


    
        // const promises = files.map((file)=>{
        //     const downloadstream = bucket.openDownloadStream(file[0]._id);
        //     let buffer = Buffer.alloc(0);
            
    
        //     return new Promise((resolve,reject)=>{
        //         downloadstream.on('data',(chunk)=>{
        //             buffer = Buffer.concat([buffer,chunk]);
        //         });
        //         downloadstream.on('error',reject);
        //         downloadstream.on('end',()=>resolve(buffer));
        //     })
        // })
    
        // try{
        //     const result = await Promise.all(promises);
        //     for(let i=0;i<result.length;i++){
        //     files[i][0].chunk = await stringmodifier( result[i].toString('base64'));
        //     }
        // }catch(error){
        //     console.log('error at cartcontroller.');
        // }
    
        // const gridfile = [];
        // for(let i =0;i<file.length;i++){
        //     gridfile[i] = files[i][0];
        // }
    
        // return gridfile;
    }catch(error){
        new badrequest('someerror',500)
    }
   
}

module.exports = {
    getfromgrid
}