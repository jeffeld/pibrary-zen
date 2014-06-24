var config = require ('../config/config'),
    mongojs = require('mongojs'),
    db = mongojs.connect(config.database, ['members']),
    _ = require('../../app/bower_components/underscore'),
    util = require('./utility'),
    events = require('events'),
    eventEmitter = new events.EventEmitter()
;

var status = {
    active : 'active',
    closed : 'closed',
    pending : 'pending',
    suspended : 'suspended',
    forcepwd : 'forcepwd'
};

exports.Get = function (spec, success, failure) {

    // We're doing a get on every member here, so don't
    // return any password data

    db.members.find (spec, {password:false}, function (err, data) {
        util.onDBComplete(data, err, success, failure);
    });

};


// success(true) will be called if the hashed version of suppliedPassword matches the stored hash
// success(fail) will be called if the hashed version of suppliedPassword DOES NOT match the stored hash
// failure() will be called for any other sort of failure

exports.ComparePassword = function (mid, suppliedPassword, success, failure) {

    var hashOfSupplied = '';

    db.members.find ( {_id : db.ObjectId(mid)}, {password : true}, function (err, data) {
        if (err) {
            failure(err);
        } else {

            // We've got the salt and the stored hash.
            // Now (using the salt) hash the supplied password and compare the
            // result with the stored hash. If they're the same, the supplied
            // password matches.

            hashOfSupplied = util.Encrypt (suppliedPassword, data.password.salt);
            success (hashOfSupplied === data.password.hash);

        }
    });

}

exports.AddMember = function (mi, success, failure) {

    var newMember = _.pick (mi, [
       'email',
       'firstname',
       'lastname',
       'role'
    ]);

    newMember.password = {
        hash : mi.password,
        salt : mi.salt
    };

    newMember.created = Date.now();
    newMember.status = status.pending;

    db.members.insert (newMember, function (err, data) {
        util.onDBComplete (data, err, success, failure);
    });

};

exports.FindByEmail = function (email, success, failure) {

    db.members.find({email: email }, function (err, data) {
        util.onDBComplete(data, err, success, failure);
    });


};