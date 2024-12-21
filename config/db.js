const mongoose=require("mongoose")


module.exports.connectdb = async() =>{
    try {
        await mongoose.connect(`mongodb+srv://guardbro85:${process.env.MONGOPW}@file-api.bswmw.mongodb.net/FILE-API`)
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Error occurred while connecting database")
    }
}

