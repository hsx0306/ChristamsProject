const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const { db, UserData } = require('./routes/db');  // db.js를 불러옵니다.

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/"));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, ""));
});

const loginRegisterRoutes = require('./routes/login_register');
app.use('/LoginRegister', loginRegisterRoutes);

app.get("/UserData/:id", (req, res) => {
  app.use(
    "/UserData",
    express.static(path.join(__dirname, `UserData/${req.params.id}.json`))
  );

  if (fs.existsSync(`./UserData/${req.params.id}.json`)) {
    // JSON 파일을 읽어서 파싱
    const jsonData = JSON.parse(
      fs.readFileSync(`./UserData/${req.params.id}.json`, "utf-8")
    );

    // 필요한 데이터만 추출
    const extractedData = {};
    extractedData.santaName = jsonData[`${req.params.id}`].santaName;
    extractedData.boxes = Object.values(jsonData[`${req.params.id}`])
      .filter((value) => typeof value === "object")
      .map((box) => ({
        boxshape: box.boxshape,
        title: box.title,
      }));

    // console.log(jsonData['boxshape']); //이거 랑 같이 해결 바람

    // 사용자에게 ejs 파일과 데이터 함께 전송
    res.render("User", extractedData); // 여기서 부터 해결
  } else {
    res.sendFile(path.join(__dirname, "Usererror.html"));
  }
});

app.get("/OauthVerification/naver", function (req, res) {
  res.sendFile(path.join(__dirname, "/OauthVerification.html"));

  // return res.status(200).send({token: `${req.email}`, ls: `${req.acess_token}`});
});

const OauthverificationRoutes = require('./routes/OauthVerification');
app.use('/OauthVerification', OauthverificationRoutes);

const registerRoutes = require('./routes/register');
app.use('/register', registerRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
