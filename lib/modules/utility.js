var _ = require('../../app/bower_components/underscore'),
    bcrypt = require('bcrypt')
;


exports.onDBComplete = function (data, err, success, failure) {

    if (err) {
        console.log ('===[');
        if (_.isFunction(failure)) {
            failure(err);
        }
        console.log (']===');
    } else {

        if (_.isFunction(success)) {
            success (data || {});
        }
    }

};


exports.Encrypt = function (v, s) {

    var SALT_WORK_FACTOR = 10,
        salt = _.isUndefined(s) ? bcrypt.genSaltSync(SALT_WORK_FACTOR) : s,
        hashedValue = bcrypt.hashSync(v, salt);

    return {
        hashedValue : hashedValue,
        salt : salt
    }

};

exports.IsValidId = function (id) {

    // Check that the ID parameter we've been sent through the
    // REST request, is valid. Caller should return 400 if this fails.

    // TODO: We probably need to beef this up, including hashing the ID before its sent to the client

    var rx = /\b[0-9A-F]{24}\b/gi;
    return id.match(rx);

};

var rxid = /\b[0-9A-F]{24}\b/gi;

exports.IsValidIdMiddleWare = function (req, res, next) {

    if (req.params.id.match(rxid)) {
        next();
    }

    return res(400, "Bad Id");
};



