const express = require("express");
const { addUser, loginUser } = require("../controllers/userController");


const userRouter=express.Router();

 
userRouter.post('/register',addUser);
userRouter.post('/login',loginUser); 

module.exports = { userRouter }