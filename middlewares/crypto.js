const crypto = require("crypto");

const encyrpt = (data) => {

    const key = Buffer.from(process.env.SECRET_KEY, "base64")
    const iv = key.slice(0, 16)

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    return (Buffer.concat([cipher.update(data), cipher.final()]));
}

const decrypt = (data) => {

    const key = Buffer.from(process.env.SECRET_KEY, "base64")
    const iv = key.slice(0, 16)

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    return (Buffer.concat([decipher.update(data), decipher.final()]));
}

module.exports = { encyrpt, decrypt }





