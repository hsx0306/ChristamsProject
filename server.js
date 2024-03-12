const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/")));
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.use(express.static(path.join(__dirname, "/Login-Register/")));

app.get('/login', (_, res) => {
    res.sendFile(path.join(__dirname, "/Login-Register/login.html"));
});

app.get('/register', (_, res) => {
    res.sendFile(path.join(__dirname, "/Login-Register/register.html"));
});


// 삭제 예정
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


// 앱에서 사용할 라우터 연결 
const OauthverificationRoutes = require('./routes/OauthVerification');
app.use('/OauthVerification', OauthverificationRoutes);

const registerRoutes = require('./routes/register');
app.use('/register', registerRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});




app.get("/treepage/:uniqueid", async (req, res) => {
  
  // id정보를 통한 user 데이터 체크
    // 데이터가 있으면 데이터페이지 // 데이터가 없으면 에러페이지로제작
  const findUserData = require('./modules/findUserData');
  const existinguniqueid = await findUserData('uniqueid', req.params.uniqueid);


  if(existinguniqueid) {
    console.log("User가 존재합니다.")
    console.log(existinguniqueid)
  }

  else if (!existinguniqueid) {
    console.log("User가 존재하지 않습니다.")
    res.sendFile(path.join(__dirname, "treepage/Usererror.html"));
  }

});
