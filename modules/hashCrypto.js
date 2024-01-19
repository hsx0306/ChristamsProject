const crypto = require('crypto');

module.exports = function hashCtypto(data) {

    const salt = "@l9_hsx";
    const hashCtyptoData = crypto
      .createHash("sha512")
      .update(data + salt)
      .digest("base64");

    return hashCtyptoData;
};
