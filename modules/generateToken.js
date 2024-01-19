const jwt = require('jsonwebtoken');

module.exports = function generateToken(id) {
    const secretKey = "@l9_hsx";
    const option = {
        algorithm: "HS256", // 해싱 알고리즘
        expiresIn: "1h", // 토큰 유효 기간
        issuer: "Christmas-framecode", // 발행자
    };
    console.log("토큰생성중")
    return jwt.sign({ id }, secretKey, option);
};
