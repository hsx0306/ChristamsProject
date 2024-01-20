const express = require('express');
const router = express.Router();

const syntaxcheck = require('../modules/syntaxcheck');
const findData = require('../modules/findData');
const saveUserData = require('../modules/saveUserData');

// const { UserData } = require('../server')




router.post("/", async function (req, res) {

    const vaild = await syntaxcheck(req.body);
    console.log(vaild.valid)
    if(!(vaild.valid)) {
        console.log(`${vaild.error}로 인한 처리 불가`)
        return res.status(400).send(vaild.error);
    }

    try {
        const existingUser = await findData('id', req.body.id);
        
        if (existingUser) {
            console.log("id가 존재함.")
            return res.status(400).send('useiderror');
        }

        const savedData = await saveUserData(req.body);
        console.log('데이터가 성공적으로 저장되었습니다.');
        console.log('저장된 데이터:', savedData);
        return res.status(200).send('success');
    }
    catch(err) {

        console.error('데이터처리 에러:' , err);
        return res.status(500).send('ServerError');
    }

});

module.exports = router;
