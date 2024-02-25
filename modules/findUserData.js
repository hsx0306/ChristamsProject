const { ConnectDatabase } = require('../routes/db.js');

const userDataSchema = {
  id: String,
  password: String,
  santaName: String,
  uniqueid: String,
};

const UserData = ConnectDatabase('userdatas', userDataSchema);  // 'userdatas' 컬렉션에 연결된 모델 생성

const userLatterSchema = {
    
}


module.exports = function findUserData(key, value) {
    console.log(`입력받은 ${value}을 DB : ${key} 항목에서 찾는 중`)
    return UserData.findOne({ [key]: value});
};
