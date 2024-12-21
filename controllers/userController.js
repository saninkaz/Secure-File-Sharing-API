
const jwt = require("jsonwebtoken")
const validator = require("validator");
const { userModel } = require("../models/userModel");
const { fileModel } = require("../models/fileModel");

//Register a User

const addUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exist = await userModel.findOne({ email })
        if (exist) {
            return res.json({ message: "User already exists" })
        }

        if (password.length < 8) {
            return res.json({ message: "Use a Strong Password" })
        }

        const User = await userModel.create(req.body);

        const token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRESIN })

        res.json({ success: true, token });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error Occurred" })
    }


}

//Login a User

const loginUser = async (req, res) => {

    const { email, password } = req.body;
    try {
        if (!email || !password || !validator.isEmail(email) || password.length < 8) {
            return res.json({ message: "Enter a valid email or password" })
        }

        const exist = await userModel.findOne({ email });
        if (!exist) {
            return res.json({ message: "The user does not exist" })
        }

        const check = await exist.comparepassword(password, exist.password)

        if (!check) {
            return res.json({ message: "The password does not match" })
        }

        const files = await fileModel.find()
        const fileIds = files.map((file) => file.id)

        console.log(fileIds);

        const IdsToRemove1 = (exist.accessFiles).filter((id) => !(fileIds.includes(id)));
        const IdsToRemove2 = (exist.sharedFiles).filter((id) => !(fileIds.includes(id)));

        await userModel.findByIdAndUpdate(exist.id, { $pull: { accessFiles: { $in: IdsToRemove1 }, sharedFiles: { $in: IdsToRemove2 } } });

        const token = jwt.sign({ id: exist.id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRESIN })

        res.json(
            {
                success: true, token: token, message: "User sucessfully logged in"
            }
        )
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error Occurred" })
    }



}

module.exports = { addUser, loginUser }

