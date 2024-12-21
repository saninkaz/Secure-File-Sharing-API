
const { fileModel } = require("../models/fileModel.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { userModel } = require("../models/userModel.js");
const { accessLog } = require("../models/accesslogModel.js");
const { encyrpt, decrypt } = require("../middlewares/crypto.js");



// Upload a File


const uploadFile = async (req, res) => {

    try {

        const user = req.user;

        const encrypted_buffer = encyrpt(req.file.buffer)      //Encrpytion of file data

        const fileData = {
            file: encrypted_buffer,
            metadata: {
                fileName: req.file.originalname,
                expiry: Date.now() + ((req.body.expiry) * 60 * 60 * 1000),
                maxDownloads: req.body.maxDownloads,
                fileType: req.file.mimetype,
            }
        }

        console.log(fileData.file)

        if (req.body.password != null && req.body.password !== "") {
            fileData.metadata.password = await bcrypt.hash(req.body.password, 10);
        }

        const file = await fileModel.create(fileData)
        console.log(file);

        user.sharedFiles.push(file.id);
        user.accessFiles.push(file.id)
        await userModel.findByIdAndUpdate(user.id, user);

        const log = {
            fileId: file.id,
            userId: user.id,
            action: 'shared',
            IpAddress: req.ip,
        }

        await accessLog.create(log);

        res.json({ sucess: true, message: "File uploaded successfully", fileID: file.id })

    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: "Error occured while uploading" })
    }

}


// File Access Verification

const fileAccess = async (req, res) => {
    try {

        const fileId = req.params.fileid;
        const file = await fileModel.findById(fileId);


        if (!file) {
            res.json({ success: false, message: "File Not Found" });
            return;
        }


        const user = req.user;


        if (user.accessFiles.includes(fileId)) {
            res.json({ message: "File Access Already Verified" })
            return;
        }


        if (file.metadata.password) {

            if (req.body.password == null) {
                res.status(401).json({ success: false, message: "Please enter password" })
                return;
            }

            if (!(await bcrypt.compare(req.body.password, file.metadata.password))) {
                res.status(401).json({ success: false, message: "Password is incorrect" })
                return;
            }

        }

        if (Date.now() >= file.metadata.expiry) {
            res.json({ success: false, message: "File is Expired" })
            return;
        }

        user.accessFiles.push(file.id);
        await userModel.findByIdAndUpdate(user.id, user)
        console.log(user);
        res.json({ success: true, message: "File Access successfully verified" })


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error occured while verifying" })
    }

}


// Download File

const downloadFile = async (req, res) => {
    try {

        const fileId = req.params.fileid;
        const file = await fileModel.findById(fileId);


        if (!file) {
            res.json({ success: false, message: "File Not Found" });
            return;
        }

        if (file.metadata.downloadCount >= file.metadata.maxDownloads) {
            res.json({ success: false, message: "Max Download Limit Reached" })
            return;
        }

        const user = req.user;


        if (!(user.accessFiles.includes(fileId))) {
            res.status(403).json({ success: false, message: "You do not have access to this file" });
            return;
        }

        if (Date.now() >= file.metadata.expiry) {
            res.json({ success: false, message: "File is Expired" })
            return;
        }


        res.set('Content-Type', file.metadata.fileType);
        res.set('Content-Disposition', `attachment; filename="${file.metadata.fileName}"`);



        (file.metadata.downloadCount)++;
        await file.save();
        console.log(file.metadata.downloadCount);

        const decrypted_buffer = decrypt(file.file) // Decryption of file

        const log = {
            fileId: file.id,
            userId: user.id,
            action: 'downloaded',
            IpAddress: req.ip,
        }

        await accessLog.create(log);

        res.send(decrypted_buffer);

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error occured while downloading" })
    }
}

// Update File

const updateFile = async (req, res) => {
    try {

        const fileid = req.params.fileid;
        const file = await fileModel.findById(fileid);

        if (!file) {
            res.json({ success: false, message: "File Not Found" });
            return;
        }

        const user = req.user;

        if (!(user.sharedFiles.includes(fileid))) {
            res.json({ success: false, message: "You are not the owner of this file" })
            return;
        }

        


        if (file.metadata.password) {

            if (req.body.password == null) {
                res.status(401).json({ success: false, message: "Please enter password" })
                return;
            }

            if (!(await bcrypt.compare(req.body.password, file.metadata.password))) {
                res.status(401).json({ success: false, message: "Password is incorrect" })
                return;
            }
        }

        const encrypted_buffer = encyrpt(req.file.buffer)      //Encrpytion of file data

        await fileModel.findByIdAndUpdate(fileid, { file: encrypted_buffer });

        const log = {
            fileId: file.id,
            userId: user.id,
            action: 'updated',
            IpAddress: req.ip,
        }

        await accessLog.create(log);

        res.json({ success: true, message: "File Successfully Updated" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error occured while updating" })
    }
}

// Delete all documents 
 
// const deleteAll = async (req, res) => {
//     try {
//         const result = await fileModel.deleteMany({})
//         console.log(result);
//         res.json({ success: true, message: "Files Deleted Successfully" })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error occured" })
//     }
// }
 
//  Delete Logs 

// const deleteAllLogs = async (req, res) => {
//     try {
//         const result = await accessLog.deleteMany({})
//         console.log(result);
//         res.json({ success: true, message: "Logs Deleted Successfully" })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error occured" })
//     }
// }



module.exports = { uploadFile, fileAccess, downloadFile, updateFile}