const express = require("express")
const multer = require("multer");
const { uploadFile, fileAccess, deleteAll, downloadFile, deleteAllLogs, updateFile } = require("../controllers/fileController");
const { addUser, loginUser } = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/auth");


const fileRouter = express.Router();

// File Storage Engine

const storage = multer.memoryStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})


const upload = multer({ storage: storage })

// Routes

fileRouter.post('/upload', upload.single("file"),authMiddleware,uploadFile);
fileRouter.post('/access/:fileid',authMiddleware,fileAccess) 
fileRouter.get('/download/:fileid',authMiddleware,downloadFile)
fileRouter.post('/update/:fileid', upload.single("file"),authMiddleware,updateFile);


module.exports = { fileRouter }

