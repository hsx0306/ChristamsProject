const { ConnectDatabase } = require('../routes/db.js');
// const UserData = getUserDataModel('userdatas');  // 'userdatas' 컬렉션에 연결된 모델을 생성
const hashCtypto = require("../modules/hashCrypto.js");

// 데이터 Schema
const userDataSchema = {
    id: String,
    password: String,
    santaName: String,
    uniqueid: String,
};
//데이터항목 저장위치 및 Schema 정리
const UserData = ConnectDatabase('userdatas', userDataSchema);


// 저장 모듈
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
