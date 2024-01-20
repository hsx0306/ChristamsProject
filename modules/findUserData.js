// const UserData = require('../server.js');  // UserData 모델이 정의된 파일의 경로를 적어주세요.
const { UserData } = require('../routes/db.js');  // UserData 모델이 정의된 파일의 경로를 적어주세요.


module.exports = function findUserData(key, value) {
    console.log("findUser진행중")
    return UserData.findOne({ [key]: value});
};