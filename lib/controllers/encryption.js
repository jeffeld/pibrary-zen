

var bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;


exports.Encrypt = function (v) {

    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR),
        hashedValue = bcrypt.hashSync(v, salt);

    return {
        hashedValue : hashedValue,
        salt : salt
    }

}
