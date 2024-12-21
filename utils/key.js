const crypto = require('crypto');

const salt = crypto.randomBytes(16);
const phrase = crypto.randomBytes(16);


const key = crypto.pbkdf2Sync(phrase, salt, 100000, 32, 'sha256');
console.log(key.toString("base64"))     //Generates the SECRET KEY


// Store this secret key in env file (SECRET_KEY)




