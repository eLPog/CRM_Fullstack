/*
a function that uses regular expressions to validate e-mail
 */
const validateEmail = function(email){
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

module.exports = {validateEmail}
