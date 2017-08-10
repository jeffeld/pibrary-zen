var config = require ('../config/config'),
    appevents = require ('../appevents'),
    _ = require('../../app/bower_components/underscore'),
    Q = require('q'),
    membersdb = require('../modules/membersdb'),
    util = require ('../modules/utility'),
    fs = require('fs')
;

exports.GetAll = function (req, res) {

    membersdb.Get({}, function (data) {
        res.send(200, data);
    }, function () {
        res.send(500);
    });
};

exports.GetByDbId = function (req, res) {

    membersdb.GetByPromise ({_id: req.params.dbid}).then(function (data) {
        data === [] ? res.send (404) : res.json (data[0]);
    }, function (error) {
        res.send (500);
    });



};




exports.GetByMembershipId = function (req, res) {

    membersdb.GetByPromise ({membershipCode: req.params.membershipcode}).then(function (data) {
        data.length === 0 ? res.send (404) : res.json (data[0]);
    }, function (error) {
        res.send (500);
    });

};

exports.GetByMembershipId2 = function (membershipCode) {

    var deferred = Q.defer();

    membersdb.GetByPromise ({membershipCode: membershipCode}).then(function (data) {
        deferred.resolve (data.length === 1 ? data[0] : {});
    }, function (error) {
        deferred.reject (error);
    });

    return deferred.promise;
};

exports.UpdateLastLoggedIn = function (email) {
    membersdb.UpdateLastLoggedIn (email);
};

exports.GetPendingActivationCount = function (req, res) {

    membersdb.GetPendingActivationCount().then(function (data) {

        res.json ({
            count: data
        });

    }, function (error) {

       res.send (500,error);

    });

};

exports.GetResetsCount = function (req, res) {

    membersdb.GetResetsCount().then(function (data) {

        res.json ({
            count: data
        });

    }, function (error) {

       res.send (500,error);

    });

};

exports.GetPendingActivations = function (req, res) {

    membersdb.GetPendingActivations().then(function (data) {
        res.json (data);
    }, function (error) {
        res.send (500, error);
    });

};

exports.Activate = function (req, res) {

    // No photo data, deny the request

    if (req.body.activationInfo.photo === 'data:,') {
        res.send (400);
    } else {

        var photo = req.body.activationInfo.photo,
            imageData = photo.substr(photo.indexOf('base64') + 7),
            ext = 'png',
            fileName = config.galleryPath + req.body.activationInfo.card + '.' + ext,
            promises = [
                util.PersistBase64DataAsFile (fileName, imageData),
                membersdb.ActivateMember (req.body.activationInfo)
            ];

        Q.allSettled (promises).then (function (data) {
            res.send (200);
        }, function (error) {
            res.send (500, error);
        });

        res.send (200);
    }

};

exports.GetMemberPhoto = function (req, res) {

    res.redirect ('/images/No Member-320x240.jpg');


    // fs.readFile (config.galleryPath + req.params.membershipcode + '.png', function (err, data) {
    //
    //     if (err) {
    //
    //         if (err.errno === 34) {
    //             res.redirect ('/images/No Member-320x240.jpg');
    //         } else {
    //             // res.send (500, err);
    //             res.redirect ('/images/No Member-320x240.jpg');
    //         }
    //
    //     } else {
    //
    //         res.writeHead(200, {'Content-Type': 'image/png' });
    //         res.end (data, 'binary');
    //
    //     }
    //
    // });

};

exports.DeletePendingActivation = function (req, res) {

    membersdb.DeleteByEmail (req.params.email).then(function (data) {
        res.send (200);
    }, function (error) {
        res.send (500, error);
    });

};

exports.SetLostPassword = function (req, res) {

    var key = req.body.key || '';

    membersdb.SetLostPassword (key.toLowerCase()).then(function (data) {

        if (data.status) {

            var resetData = data.data;

            resetData.resetLink = req.headers.origin + '/passwordreset?sid=' + resetData._id.toString();
            appevents.emit ('Password-Reset-Request', resetData);

            res.send (200);
        } else {
            res.send (404);
        }

    }, function (error) {
        res.send (500);
    });


};

exports.GetPasswordReset = function (id) {

    var deferred = Q.defer();

    membersdb.GetPasswordReset (id).then(function (data) {
        deferred.resolve(data);
    });

    return deferred.promise;

};

exports.ResetPassword = function (req, res) {

    var id = req.params.id || '',
        newPassword = req.body.password || '';

    membersdb.ResetPassword (id, newPassword).then(function (data) {
        res.send (200);
    }, function (error) {
        res.send (500);
    });

};

