const express = require("express");
const router = express.Router();

const syntaxcheck = require("../modules/syntaxcheck");
const findData = require("../modules/findData");
const generateToken = require("../modules/generateToken");
const hashCtypto = require("../modules/hashCrypto");

router.post("/", async function (req, res) {
  const LoginData = syntaxcheck(req.body);

  // 로그인 요청의 문법을 확인
  if (!LoginData.valid) {
    console.log(`${LoginData.error}로 인한 처리 불가`);
    return res.status(400).send(LoginData.error);
  }

  try {
    const existingUser = await findData('id', req.body.id);

    if (!existingUser) {
      console.log("id가 존재하지 않음");
      return res.status(400).send("useiderror");
    }
    
    const hashPassword = hashCtypto(req.body.password)

    if (hashPassword == existingUser.password) {
      console.log("DB의 hash값과 일치하여 토큰을 발행합니다.");
      const token = generateToken(existingUser.id);
      return res
        .status(200)
        .send({ token: `${token}`, ls: `${existingUser.id}` });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("searcherror");
  }
});

module.exports = router;
