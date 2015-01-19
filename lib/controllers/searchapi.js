var config = require ('../config/config'),
    appevents = require ('../appevents'),
    _ = require('../../app/bower_components/underscore'),
    Q = require('q'),
    orac = require ('../modules/orac'),
    membersdb = require ('../modules/membersdb')
;

function SearchForMembers (spec) {

    var deferred = Q.defer(),
        mrx = /08(?:\d{1,8})$/,
        startswith = /^08/,
        spec2;

    if (startswith.test(spec)) {

        spec2 = spec.replace(/\s/g, '');

        if (mrx.test(spec2)) {
            membersdb.FindByMobile(spec2).then(function (data) {
                deferred.resolve (data);
            }, function (error) {
                deferred.reject (error);
            });
        }



    } else {

        membersdb.FindByEitherNameOrEmail (spec).then(function (data) {
            deferred.resolve (data);
        }, function (error) {
            deferred.reject (error);
        });

    }

    return deferred.promise;

}

exports.Get = function (req, res) {

    switch (req.query.idx) {
        case 'auto':
            orac.search (req.query.q, function (data) {
                res.json (data);
            }, function () {
                res.send (500);
            });
            break;

        case 'members':
//            res.json ();
            SearchForMembers(req.query.q).then(function (data) {
                res.json (data);
            }, function (error) {
                res.send (500);
            });
            break;
    }


};

exports.GetByISBN = function (req, res) {

    orac.GetByISBN (req.params.isbn, function (data) {
        res.send (200, data)
    }, function (data) {
        res.redirect ('500');
    });

};

exports.ExternalGetByISBN = function (req,res) {

    orac.ExternalGetByISBN(req.params.isbn, function (data) {

        _.isEmpty(data) ? res.send (404) : res.send(200, data);

    }, function (data) {
        res.redirect('500');
    });

};

exports.GetByStockCode = function (req, res) {
    orac.GetByStockCode (req.params.stockcode, function (data) {
        res.send(200, data)
    }, function (data) {
        res.redirect('500');
    });
}

