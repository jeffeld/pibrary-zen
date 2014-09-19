var jade = require ('jade'),
    db = require ('../modules/emailsdb.js'),
    _ = require('../../app/bower_components/underscore'),
    util = require ('../modules/utility'),

    editableFields = ['to', 'subject', 'status']
;

function path(f) {
    return './lib/resources/emails/' + f;
}

function isValidId (id) {
    // Make sure the ID is in the format expected by the DB engine
    var rx = /\b[0-9A-F]{24}\b/gi;
    return id.match(rx);
}

function send (emailLayout, data, subject) {

    var body = jade.renderFile (path(emailLayout), data);

    db.Upsert ({
        to : data.email,
        subject : subject,
        body : body
    }, function (){
        console.log ("Email added");
    }, function () {
        console.log ("Email failed to be added");
    });

}

exports.Post = function (req, res) {

    // This is for updating existing emails

    // Compose spec and call db.Upsert!


    if (! util.IsValidId(req.params.id)) {
        res.send (400);
        return;
    }

    var spec = _.pick (req.body, editableFields);
    spec.id = req.params.id;

    db.Upsert(spec, function () {
        res.send(200);
    }, function () {
        res.send(500);
    });


};

exports.GetAll = function (req, res) {

    var spec = _.pick (req.query, editableFields);

    db.Get (spec, function (data){
        res.send (200, data);
    }, function () {
        res.send (500);
    });

};

exports.Get = function (req, res) {

    if (! util.IsValidId(req.params.id)) {
        res.send (400);
        return;
    }

    db.Get ({id : req.params.id}, function (data) {

        if (_.isEmpty(data)) {
            res.send (404);
        } else {
            res.set ('Content-Type', 'text/html; charset=UTF-8');
            res.send (data[0].body);
        }

    }, function () {
        res.send (500);
    });

};

exports.Delete = function (req, res) {

    db.Delete(req.params.id, function () {
        res.send(200);
    }, function () {
        res.send(500);
    });

};

exports.GetCount = function (req, res) {

    db.GetCount().then(function (data) {
        res.json ({
            count : data
        });
    }, function (error) {
       res.send (500, error);
    });


}

exports.SignUp_New = function (mi) {
    send ('signup/signup-new.jade', mi, "Sign up request for The Library");
};

exports.SignUp_Approved = function (mi) {
    send ('signup/signup-approved.jade', mi, "Approved - Your library sign up request");
};

exports.SignUp_Rejected = function (mi) {
    send ('signup/signup-rejected.jade', mi, "Rejected - Your library sign up request");
};



