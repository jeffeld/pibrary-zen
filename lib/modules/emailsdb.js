var config = require ('../config/config'),
    mongojs = require('mongojs'),
    db = mongojs.connect(config.database, ['emails']),
    _ = require('../../app/bower_components/underscore'),
    util = require('./utility')
;

exports.Upsert = function (email, success, failure) {

    var update = {},
        query = {};

    // If there is no id fields, then this is a new email.

    if (_.isUndefined(email.id)) {
        update = _.extend({}, email, {
                status: 'pending',
                submitted: Date.now()
            }
        );

    } else {

        // ... else we're updating an existing email.

        update = {
            lastupdated : Date.now()
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



    db.emails.update (query, update, {upsert : true}, function (err,data) {
        util.onDBComplete (data, err, success, failure);
    });

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

