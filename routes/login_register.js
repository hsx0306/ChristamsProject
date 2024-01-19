// routes/loginRegister.js
const express = require('express');
const router = express.Router();
const path = require('path');

router.use(express.static(path.join(__dirname, "../Login-Register")));

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "../Login-Register/login.html"));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, "../Login-Register/register.html"));
});

module.exports = router;
