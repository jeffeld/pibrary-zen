var config = require ('../config/config'),
    mongojs = require('mongojs'),
    db = mongojs.connect(config.database, ['members']),
    _ = require('../../app/bower_components/underscore'),
    util = require('./utility')
;

var status = {
    active : 'active',
    closed : 'closed',
    pending : 'pending',
    suspended : 'suspended',
    forcepwd : 'forcepwd'
};

exports.AddMember = function (mi, success, failure) {

    var newMember = _.pick (mi, [
       'email',
       'firstname',
       'lastname',
       'role',
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

    var e = email;


    db.members.find({email: e }, function (err, records) {
        util.onDBComplete(records, err, success, failure);
    });


};