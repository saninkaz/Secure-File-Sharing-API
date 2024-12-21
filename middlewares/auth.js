const { userModel } = require("../models/userModel");
const jwt = require("jsonwebtoken")

const authMiddleware = async (req, res, next) => {

    let token = req.headers.authorization
    if (!token) {
        return res.json({ message: "You do not have access to this route" })
    }
    token = token.split(' ')[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decode.id)

        if (!user) {
            return res.json({ message: "User not found error" })
        }
        req.user=user;
        next();

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error Occurred" })
    }
}

module.exports = { authMiddleware }