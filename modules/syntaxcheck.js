var emailRegex = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/;
var uniqueidRegex = /^[A-Za-z0-9]{1,16}$/;

module.exports = function syntaxcheck(data) {
    console.log("Syntaxcheck진행중")
    if (!emailRegex.test(data.id)) return { valid: false, error: 'emailerror' };
    if (!passwordRegex.test(data.password)) return { valid: false, error: 'passworderror' };
    if (data.uniqueid && !uniqueidRegex.test(data.uniqueid)) return { valid: false, error: 'uniqueiderror' }; 
    return { valid: true };
};
