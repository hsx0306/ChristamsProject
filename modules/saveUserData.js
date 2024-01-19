// saveUser.js
// const UserData = require('../server.js');  // UserData 모델이 정의된 파일의 경로를 적어주세요.

const { UserData } = require('../routes/db.js');  // UserData 모델이 정의된 파일의 경로를 적어주세요.

const hashCtypto = require("../modules/hashCrypto.js");

module.exports = function saveUserData(data) {
    console.log("saveUserData진행중")

    const hashPassword = hashCtypto(data.password)

    const newData = {
        uniqueid: data.uniqueid,
        santaName: data.santaName,
        id: data.id,
        password: hashPassword,
    };

    return UserData.create(newData);
};
