const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const crypto = require("crypto");

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, ""));
});

// '/Login-Register' 안의 정적 파일 제공
app.use(
  "/LoginRegister",
  express.static(path.join(__dirname, "Login-Register"))
);

app.get("/LoginRegister/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./Login-Register/login.html"));
});

app.get("/LoginRegister/register", (req, res) => {
  res.sendFile(path.join(__dirname, "./Login-Register/register.html"));
});

app.get("/UserData/:id", (req, res) => {
  app.use(
    "/UserData",
    express.static(path.join(__dirname, `UserData/${req.params.id}.json`))
  );

  // if(fs.existsSync(`UserData/${req.params.id}.json`)) {
  //   const jsonData = fs.readFileSync(`./UserData/${req.params.id}.json`, 'utf-8');
  //   console.log(jsonData); // 저장한 JSON 데이터 확인
  //       res.sendFile(path.join(__dirname, `User.html`));

  // }
  // else {
  //   res.sendFile(path.join(__dirname, `Usererror.html`));
  // }

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

// 이메일 password 양식을 체크 이후 검증
app.post("/OauthVerification", function (req, res) {
  var emailRegex = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  // '^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
  var passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/;
  // "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$"

  if (
    emailRegex.test(req.body.id) === false ||
    passwordRegex.test(req.body.password) == false
  ) {
    if (emailRegex.test(req.body.id) === false) {
      return res.status(400).send("emailerror");
    }

    if (passwordRegex.test(req.body.password) === false) {
      return res.status(400).send("passworderror");
    }
  } else {
    UserData.findOne({ id: `${req.body.id}` })
      .then((result) => {
        if (!result) {
          console.log("데이터 조회 불가");
          return res.status(400).send("Loginerror");
        } else {
          console.log("요청 ID가 존재합니다.");

          const salt = "@l9_hsx";
          const hashPassword = crypto
            .createHash("sha512")
            .update(req.body.password + salt)
            .digest("base64");
          console.log(hashPassword);
          if (hashPassword == result.password) {
            console.log("DB랑 hash가 일치합니다.");

            const jwt = require("jsonwebtoken");
            const secretKey = "@l9_hsx";
            const option = {
              algorithm: "HS256", // 해싱 알고리즘
              expiresIn: "1h", // 토큰 유효 기간
              issuer: "Christmas-framecode", // 발행자
            };

            token = jwt.sign({ id: `${result.id}` }, secretKey, option);

            console.log("JWT token이 발급되었습니다.");
            return res
              .status(200)
              .send({ token: `${token}`, ls: `${result.id}` });
          } else {
            console.log("로그인에러");
            return res.status(400).send("Loginerror");
          }
        }
      })

      .catch((err) => {
        if (err) {
          console.log(err);
          return res.status(400).send("searcherror");
        }
      });
  }
});

app.post("/register", function (req, res) {
  // console.log(req.body);
  console.log(req.body);

  var emailRegex = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  // '^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
  var passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/;
  var uniqueidRegex = /^[A-Za-z0-9]{1,8}$/;
  var santaNameRegex = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{1,3}$/;

  if (emailRegex.test(req.body.id) === false) {
    console.log("이메일 양식에러");
    return res.status(400).send("emailerror");
  } else {
    UserData.findOne({ id: `${req.body.id}` })

      .then((result) => {
        if (result) {
          console.log("사용중인 아이디");
          return res.status(400).send("useiderror");
        } else {
          if (passwordRegex.test(req.body.password) === false) {
            console.log("패스워드 양식에러");
            return res.status(400).send("passworderror");
          }

          if (uniqueidRegex.test(req.body.uniqueid) === false) {
            console.log("유니크아이디 양식에러");
            return res.status(400).send("uniqueiderror");
          }

          if (santaNameRegex.test(req.body.santaName) === false) {
            console.log("산타이름 양식에러");
            return res.status(400).send("santaNameerror");
          }

          const salt = "@l9_hsx";
          const hashPassword = crypto
            .createHash("sha512")
            .update(req.body.password + salt)
            .digest("base64");
          // const token = crypto.createHash('sha512').update(req.body.id + hashPassword + salt).digest('base64')
          const newData = {
            uniqueid: `${req.body.uniqueid}`,
            santaName: `${req.body.santaName}`,
            id: `${req.body.id}`,
            password: `${hashPassword}`,
            // token: `${token}`
          };

          UserData.create(newData)
            .then((savedData) => {
              console.log("데이터가 성공적으로 저장되었습니다.");
              console.log("저장된 데이터:", savedData);
              return res.status(200).send("success");
            })
            .catch((err) => {
              console.error("데이터 저장 에러:", err);
            });
        }
      })

      .catch((err) => {
        if (err) {
          console.error("데이터 조회 에러:", err);
          return res.status(400).send("SearchError");
        }
      });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
