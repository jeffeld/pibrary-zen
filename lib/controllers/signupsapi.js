
var config = require ('../config/config'),
    appevents = require ('../appevents'),
    _ = require('../../app/bower_components/underscore'),
    Q = require('q'),
    encrypt = require('./encryption'),
    membersdb = require('../modules/membersdb'),
    signupsdb = require('../modules/signupsdb')
;


function encryptPassword (password) {

    var v = encrypt.Encrypt(password);

    return {
        password : v.hashedValue,
        salt : v.salt
    }
}

exports.Add = function (req, res) {

    var o = req.body;
    if ((o.firstname.length === 0 || o.lastname.length === 0) ||
        (o.firstname.length > 50 || o.lastname.length > 50)
       ) {
        res.send (400);
        return;
    }

    if ((o.password1.length === 0 || o.password2.length === 0) ||
        (o.password1 !== o.password2)
        ) {
        res.send (400);
        return;
    }

    if ((o.email1.length === 0 || o.email2.length === 0) ||
        (o.email1 !== o.email2)

        ) {
        res.send (400);
        return;
    }

    // Encrypt the password supplied, store it (and the salt).

    var encryptedPassword = encryptPassword (o.password1);
    o.password = encryptedPassword.password;
    o.salt = encryptedPassword.salt;

    // Canonicalize the email address

    o.email = o.email1.toLowerCase();

    // Strip off fields we don't want (including the en clair passwords)

    var newSignUp = _.omit (o, ['password1', 'password2', 'email1', 'email2']);

    // Check we don't have another member already using this email
    // address.

    membersdb.FindByEmail(newSignUp.email, function (data) {

        if (! _.isEmpty(data)) {
            // email address already used!
            res.send(400);
            return;
        }

        // Timestamp the sign up and record the ip address

        newSignUp.datetime = new Date(); // Date.now();
        newSignUp.ip = req.ip;

        // Store the data in the signups collection in the database

        signupsdb.Add(newSignUp, function (dataAdd) {

            // Use the db's object id and send the data
            // back to the caller indicating the sign up
            // request has been created.

            newSignUp.id = dataAdd._id.toString();

            // Tell the application we've created a new sign-up

            appevents.emit ('SignUp-New', newSignUp);

            res.send(201, newSignUp);


        }, function (err) {
            if (err.code === 11000) {

                // Index key violation. There is another pending
                // signup using the same email address.

                res.send(400);

            } else {
                res.send(500);
            }
        });

    }, function (err) {
        res.send(500);
    });

};

exports.GetAll = function (req, res) {

    // Get all the pending sign up requests.
    // Before sending the data back to the client,
    // sanitize the data (i.e. removing sensitive fields
    // like the password)

    signupsdb.GetAll (function (data) {
        var forClient = [];
        _.each (data, function (e) {
            forClient.push (_.omit (e, ['password', 'salt']));
        });

        res.send (200, forClient);

    }, function () {
        res.send (500);
    });

};

exports.Delete = function (req, res) {

    // Firstly we need to get all the sign up data
    // for this particular request, as we only get
    // the id from the client (by design).

    signupsdb.Get(req.params.id, function (data) {

        // Remove the sign up request from the database

        var isReject = _.isUndefined(req.query.forceDelete);

        signupsdb.Delete(req.params.id, function () {

            if (isReject) {
                appevents.emit('SignUp-Rejected', data);
            }

            res.send(200);
        }, function () {
            res.send(500);
        });

    });

};

exports.Post = function (req, res) {

    console.log ("Approving sign-up id " + req.params.id);

    // Firstly we need to get all the sign up data
    // for this particular request, as we only get
    // the id from the client (by design).

    signupsdb.Get (req.params.id, function (data) {

        // Now add a new member using the data supplied
        // during the sign up process. This includes
        // the password (which has already been encrypted)

        membersdb.AddMember (data, function () {

            // The member entry has been created, so delete
            // the sign up request. We don't need it anymore.

            signupsdb.Delete (req.params.id, function () {
                appevents.emit ('SignUp-Approved', data);
                res.send (200);
            }, function () {
                res.send (500);
            });

        }, function () {
            res.send(500);
        });

    }, function () {
        res.send(500);
    });

};

exports.GetOutstandingCount = function (req, res) {

    signupsdb.GetPendingCount().then(function (data) {
        res.json ({
           count : data
        });
    }, function (error) {
        res.send (500, error);
    });



};