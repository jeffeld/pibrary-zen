
var config = require ('../config/config'),
    mongojs = require('mongojs'),
    db = mongojs.connect(config.database, ['signups', 'members']),
    _ = require('../../app/bower_components/underscore'),
    encrypt = require('./encryption'),
    members = require('../modules/members'),
    signups = require('../modules/signupsdb')
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

    var record = _.omit (o, ['password1', 'password2', 'email1', 'email2']);

    // Check we don't have another member already using this email
    // address.

    members.FindByEmail(record.email, function (data) {

        if (! _.isEmpty(data)) {
            // email address already used!
            res.send(400);
            return;
        }

        // Timestamp the signup and record the ip address

        data.datetime = Date.now();
        data.ip = req.ip;

        // Store the data in the signups collection in the database

        signupsdb.Add(data, function (dataAdd) {

            // Use the db's object id and send the data
            // back to the caller indicating the sign up
            // request has been created.

            data.id = dataAdd._id.toString();

            res.send(201, data);


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

    // Remove the sign up request from the database

    signupsdb.Delete(req.params.id, function () {
        res.send(200);
    }, function () {
        res.send(500);
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

        members.AddMember (data, function () {

            // The member entry has been created, so delete
            // the sign up request. We don't need it anymore.

            signupsdb.Delete (req.params.id, function () {
                res.send (200);
            }, function () {
                res.send (500);
            });

        }, function () {
            res.send(500);
        });

    }, function (){
        res.send(500);
    });

};

