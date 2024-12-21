const mongoose=require("mongoose");

const File= new mongoose.Schema({
     file:{
      type:Buffer
     },
     metadata:{
     fileName:{
        type:String,
        required:true
     },
     expiry:{
        type:Number,
        required:true,
        default: Date.now()+86400000 // 24 hours
     },
     maxDownloads:{
        type:Number,
        required:true,
        default:10
     },
     downloadCount:{
        type:Number,
        required:true,
        default:0
     },
     password:{
        type:String
     },
     fileType:{
      type:String
     }
   }
},{timestamps:true})

const fileModel = mongoose.models.file || mongoose.model("file",File)

module.exports = {fileModel} 