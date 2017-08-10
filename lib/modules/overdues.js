var config = require ('../config/config'),
    mongojs = require('mongojs'),
    db = mongojs(config.database, ['currentLoans']),
    _ = require('../../app/bower_components/underscore'),
    Q = require('q')
;

var overdueSpec = function () {
    return {
        returnDate: {
            $lt: new Date()
        }
    };
};

exports.GetOverdueCount = function () {

    var deferred = Q.defer();

    db.currentLoans.count(overdueSpec(), function (err, data) {

        if (err) {
            deferred.reject (err);
        } else {
            deferred.resolve (data);
        }

    });

    return deferred.promise;

};

exports.GetOverdues = function ()  {

    var deferred = Q.defer();

    db.currentLoans.find (overdueSpec(), function (err, data) {

        if (err) {
            deferred.reject (err);
        } else {
            deferred.resolve (data);
        }


    });

    return deferred.promise;

}