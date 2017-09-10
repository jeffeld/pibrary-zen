var config = require('../config/config'),
    _ = require('../../app/bower_components/underscore'),
    moment = require('moment'),
    bcrypt = require('bcrypt-nodejs'),
    fs = require('fs'),
    Q = require('q'),
    AWS = require('aws-sdk')
;


exports.onDBComplete = function (data, err, success, failure) {

    if (err) {
        console.log ('===[');
        console.log (err);
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

exports.AnyUndefined = function (values) {

    if (_.isArray(values)) {
        _.each (values, function (v) {
            if (_.isUndefined(v)) {
                return true;
            }
        });

        return false;
    }

    return !_.isDefined(values);

};

exports.Calendar = {

    TodaysReturnDate : function (membershipCode) {

        // TODO: We may need to take into account the membership code when
        // determining loan types (bulk loans) etc.

        return this.ReturnDate();
    },

    ReturnDate :function (days) {


        // Calculate today + (days || defaultLoanInDays) and check that it's
        // a working day. If it isn't a working day, then keep adding one day
        // until you reach a working day.

        // TODO: What should we do when faced with 3 month school holidays?

        var loanInDays = _.isUndefined(days) ? config.defaultLoanInDays : days,
            d = moment().add(loanInDays, 'days'),
            isHoliday = function (n) {
                return false;
            },
            isNotWorkDay = function (n) {
                return _.some (config.notWorkDays, function (v) {
                    if (n.day() === v) {
                        return true;
                    }
                });
            };

        while (isNotWorkDay(d) || isHoliday(d)) {
            d = moment(d).add(1, 'days');
        }

        // Make sure the timestamp portion is for the last possible moment of the date
        return d.hours(23).minutes(59).seconds(59)._d;

    }

};


exports.PersistBase64DataAsFile = function (filename, data) {

    var deferred = Q.defer();

    var buffer = new Buffer (data, 'base64');

    fs.writeFile (filename, buffer, function (err) {
        if (err) {
            deferred.reject (err);
        } else {
            deferred.resolve ();
        }
    });

    return deferred.promise;

};


exports.UploadToS3 = function (filename, data) {


    const deferred = Q.defer();

    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    const buffer = new Buffer(data, 'base64');

    const s3 = new AWS.S3();
    s3.putObject({
        Bucket: process.env.S3_MUGSHOTS_BUCKET,
        Key: filename,
        Body: buffer,
        ACL: 'public-read'
    }, function (resp) {

        if (resp === null) {
            console.log(`...uploaded mugshot OK.`);
            deferred.resolve();
        } else {
            console.log(`...uploading mugshot FAILED.`);
            deferred.reject(resp);
        }
    });

    return deferred;

};


// Returns a RFC4122 compliant guid
exports.generateUUID = function () {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};
