var mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://1317hsb:21Mbt8ppjFjhKOpk@christmas-user.dpy6wtl.mongodb.net/UserData"
);
var db = mongoose.connection;

db.on("error", function () {
  console.log("Connection Failed!");
});
db.once("open", function () {
  console.log("Connected!");
});

// 컬렉션 이름과 스키마를 함수의 인자로 받습니다

const ConnectDatabase = (collectionName, schemaDefinition) => {
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName];
  } else {
    const schema = new mongoose.Schema(schemaDefinition, { versionKey: false });
    return mongoose.model(collectionName, schema);
  }
}


module.exports = { db, ConnectDatabase };
