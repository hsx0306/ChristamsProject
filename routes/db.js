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

const userDataSchema = new mongoose.Schema(
  {
    id: String,
    password: String,
    santaName: String,
    uniqueid: String,
  },
  { versionKey: false }
);

const UserData = mongoose.model("UserData", userDataSchema);

module.exports = { db, UserData };
