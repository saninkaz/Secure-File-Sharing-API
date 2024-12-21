const express = require("express")
const cors = require("cors");
const multer = require("multer")
const bcrypt = require("bcrypt");
const { connectdb } = require("./config/db.js");
const mongoose = require("mongoose");
const { fileModel } = require("./models/fileModel.js");
const { fileRouter } = require("./routes/fileRoutes.js");
const { userRouter } = require("./routes/userRoute.js");

require("dotenv").config()


// app config
 
const app = express();
const PORT = process.env.PORT


// Middleware

const upload = multer({ dest: "uploads" })
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs")
app.use(express.json());
app.use(cors());


// Routes

app.get('/', (req, res) => {
    res.render("index")
})
app.use('/api/files', fileRouter);
app.use('/api/user',userRouter);


//Database config

connectdb();


//Connect server

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})


