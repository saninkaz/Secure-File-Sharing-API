const mongoose=require("mongoose")


module.exports.connectdb = async() =>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`)
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Error occurred while connecting database")
    }
}

