const crypto = require('crypto');
require("dotenv").config();

module.exports = function hashCtypto(data) {

    const salt = process.env.secretKey;
    const hashCtyptoData = crypto
      .createHash("sha512")
      .update(data + salt)
      .digest("base64");

    return hashCtyptoData;
};
