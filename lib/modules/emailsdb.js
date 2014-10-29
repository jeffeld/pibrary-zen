var config = require ('../config/config'),
    mongojs = require('mongojs'),
    db = mongojs.connect(config.database, ['emails']),
    _ = require('../../app/bower_components/underscore'),
    Q = require('q'),
    util = require('./utility'),
    TTLIndex = {
        'submitted' : 1
    }
;

db.emails.dropIndex (TTLIndex);
db.emails.ensureIndex (TTLIndex, {expireAfterSeconds: 60 * 60 * 24 * 60});

exports.Upsert = function (email, success, failure) {

    var update = {},
        query = {};

    // If there is no id fields, then this is a new email.

    if (_.isUndefined(email.id)) {
        update = _.extend({}, email, {
                status: 'pending',
                submitted: new Date()
            }
        );

    } else {

        // ... else we're updating an existing email.

        update = {
            lastupdated : new Date()
        };

        // Set the _id field (which the DB uses) and mask off
        // off the id field (note: no underscore) as it arrives
        // from the request.

        query = {
            _id: db.ObjectId(email.id)
        };
        email = _.omit (email, 'id');

        update = {
            $set: _.extend({}, email, update)
        };
    }

    if (_.isUndefined(query._id)) {
        db.emails.insert (update, function (err,data) {
            util.onDBComplete (data, err, success, failure);
        });
    } else {
        db.emails.update (query, update, {upsert : true}, function (err,data) {
            util.onDBComplete (data, err, success, failure);
        });
    }

}

exports.Get = function (spec, success, failure) {

    // Just convert the ID field into the form the database
    // is expecting, and remove the passed in id to
    // prevent confusion.

    if (! _.isUndefined (spec.id)) {
        spec._id = db.ObjectId(spec.id);
        spec = _.omit(spec, 'id');
    }

    // If we're searching on the to or subject fields,
    // then do a regex search. It's more helpful to the
    // user. Just make sure these fields have the
    // appropriate indexes on!

    // TODO: Index the to and subject fields!

    if (!_.isUndefined (spec.to)) {
        spec.to = { $regex: spec.to, $options: 'i' };
    }

    if (!_.isUndefined (spec.subject)) {
        spec.to = { $regex: spec.subject, $options: 'i' };
    }

    // Do the search!

    db.emails.find (spec, function (err,data){
        util.onDBComplete (data, err, success, failure);
    });


};

exports.Delete = function (id, success, failure) {

    db.emails.remove ({_id : db.ObjectId(id)}, true, function (err, data) {
        util.onDBComplete (data, err, success, failure);
    });

};

exports.GetCount = function () {

    var deferred = Q.defer();

    db.emails.find ({status : 'pending'}).count (function (err, data){
       if (err) {
           deferred.reject (err);
       } else {
           deferred.resolve ((_.isNumber(data) && !_.isNaN(data)) ? data : -1);
       }
    });

    return deferred.promise;

};

