var config = require ('../config/config'),
    mongojs = require('mongojs'),
    db = mongojs.connect(config.database, ['members', 'resets']),
    _ = require('../../app/bower_components/underscore'),
    Q = require('q'),
    util = require('./utility'),
    events = require('events'),
    eventEmitter = new events.EventEmitter(),
    encrypt = require('../controllers/encryption')
;

var status = {
    active : 'active',
    closed : 'closed',
    pending : 'pending',
    suspended : 'suspended',
    forcepwd : 'forcepwd'
};

var safeSpec = {
    firstname: 1,
    lastname: 1,
    email: 1,
    mobile: 1,
    membershipCode: 1
};




db.resets.ensureIndex ({'created': 1}, {expireAfterSeconds: 60 * 60 * 72});
db.members.ensureIndex ({firstname: 'text'});
db.members.ensureIndex ({lastname: 'text'});
db.members.ensureIndex ({email: 'text'});
db.members.ensureIndex ({membershipCode: 1}, {unique: true});
db.members.ensureIndex ({mobile: 1});


exports.Get = function (spec, success, failure) {

    // We're doing a get on every member here, so don't
    // return any password data

    db.members.find (spec, {password:false}, function (err, data) {
        util.onDBComplete(data, err, success, failure);
    });

};

exports.GetByPromise = function (spec) {

    var deferred = Q.defer();

    if (!_.isUndefined(spec._id)) {
        spec._id = db.ObjectId(spec._id);
    }


    // Never, ever return the password field

    db.members.find (spec, {password:false}, function (err, data) {

        if (err) {
            deferred.reject (err);
        } else {
            deferred.resolve (data || []);
        }

    });

    return deferred.promise;

};

function update (spec, updates) {

    var deferred = Q.defer();

    db.members.update (spec, updates, function (err, data) {

        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve (data);
        }

    });

    return deferred.promise;

};

exports.Update = function (spec, updates) {
    return update (spec, updates);
};

// success(true) will be called if the hashed version of suppliedPassword matches the stored hash
// success(fail) will be called if the hashed version of suppliedPassword DOES NOT match the stored hash
// failure() will be called for any other sort of failure

exports.ComparePassword = function (mid, suppliedPassword, success, failure) {

    var hashOfSupplied = {};

    var id = _.isString (mid) ? db.ObjectId(mid) : mid;


    db.members.findOne ({_id : id}, {password : true}, function (err, data) {
        if (err) {
            failure(err);
        } else {

            // We've got the salt and the stored hash.
            // Now (using the salt) hash the supplied password and compare the
            // result with the stored hash. If they're the same, the supplied
            // password matches.

            var user = data;

            hashOfSupplied = util.Encrypt (suppliedPassword, user.password.salt);
            success (hashOfSupplied.hashedValue === user.password.hash);

        }
    });

}

exports.AddMember = function (mi, success, failure) {

    var newMember = _.pick (mi, [
       'email',
       'firstname',
       'lastname',
       'role',
       'mobile'
    ]);

    newMember.password = {
        hash : mi.password,
        salt : mi.salt
    };

    newMember.created = Date.now();
    newMember.status = status.pending;
    newMember.userlevel = 0;

    newMember.numVisits = 0;
    newMember.numLoans = 0;

    // Teachers are bulk loans by default. Everyone else has limited loan capability.
    newMember.loanType = mi.role.value === 'ts' ? 'bulk' : 'normal';
    newMember.maxLoans = mi.role.value === 'ts' ? -1 : 2;


    db.members.insert (newMember, function (err, data) {
        util.onDBComplete (data, err, success, failure);
    });

};

exports.FindByEmail = function (email, success, failure) {

    db.members.findOne({email: email }, function (err, data) {
        util.onDBComplete(data, err, success, failure);
    });


};

exports.FindByEmailOrMobile = function (email, mobile, success, failure) {

    db.members.findOne( { $or : [{email: email}, {mobile: mobile}]}
        , function (err, data) {
        util.onDBComplete(data, err, success, failure);
    });


};

exports.FindByMobile = function (mobile) {
    var deferred = Q.defer(),
        mobilerx = '^' + mobile,
        query = {
            // $exists is requires 2.6.7!
            // $exists: {membershipCode: true},
            mobile: { $regex: mobilerx }
        };




    db.members.find (query, safeSpec, function (err, data) {
        if (err) {
            deferred.reject (err);
        } else {

            // Until we can upgrade to mongo 2.6.7 on Arch,
            // we can't use the $exists operator. We fudge the
            // the behaviour below.

            var filtered = _.filter (data, function (o) {
                return o.hasOwnProperty ('membershipCode');
            });
            deferred.resolve (filtered);
        }
    });

    return deferred.promise;
};

exports.FindByEitherNameOrEmail = function (name) {

    var deferred = Q.defer(),
        query = {
            // $exists is requires 2.6.7!
            // $exists: {membershipCode: true},
            $text : {$search: name},
        };

    db.members.find (query, safeSpec, function (err, data) {

        if (err) {
            deferred.reject (err);
        } else {

            // Until we can upgrade to mongo 2.6.7 on Arch,
            // we can't use the $exists operator. We fudge the
            // the behaviour below.

            var filtered = _.filter (data, function (o) {
                return o.hasOwnProperty ('membershipCode');
            });
            deferred.resolve (filtered);
        }

    });


    return deferred.promise;
}

exports.FindByMembershipId = function (membershipId, success, failure) {

    db.members.findOne({membershipCode: membershipId}, function (err, data){
        util.onDBComplete(data, err, success, failure);
    });

};

exports.UpdateLastLoggedIn = function (email, success, failure) {

    // Called when the user has successfully logged in.
    // We can keep track of how many visits and when they
    // last visited.

    db.members.update({email: email},
        {
            $set: {lastLoggedIn: Date.now()},
            $inc: {numVisits : 1}
        },
        {multi: false}
    );

};

exports.GetPendingActivationCount = function () {

    var deferred = Q.defer();

    db.members.find ({status: status.pending}).count(function (err, data){

        if (err) {
            deferred.reject (err);
        } else {
            deferred.resolve ((_.isNumber(data) && !_.isNaN(data)) ? data : -1);
        }

    });

    return deferred.promise;

};

exports.GetResetsCount = function () {

    var deferred = Q.defer();

    db.resets.find ({}).count(function (err, data){

        if (err) {
            deferred.reject (err);
        } else {
            deferred.resolve ((_.isNumber(data) && !_.isNaN(data)) ? data : -1);
        }

    });

    return deferred.promise;

};

function getMembersWithStatus (status) {

    var deferred = Q.defer();

    db.members.find ({status: status}, {password : false}, function (err, data) {

        if (err) {
            deferred.reject (err);
        } else {
            deferred.resolve (data || []);
        }

    });


    return deferred.promise;
};

exports.GetPendingActivations = function () {

    var deferred = Q.defer();

    getMembersWithStatus(status.pending).then(function (data) {
            deferred.resolve(data);
        }, function (error) {
            deferred.reject(error);
        }
    );

    return deferred.promise;

};

exports.ActivateMember = function (member) {

    var deferred = Q.defer();

    this.Update({_id: db.ObjectId(member.dbid)},
        {$set: {
            membershipCode: member.card,
            status : status.active,
            activated : Date.now(),
            lastUpdated : Date.now()
        }
    }).then (function (data) {
        deferred.resolve (data);
    });

    return deferred.promise;


};

exports.DeleteByEmail = function (email) {

    var deferred = Q.defer();

    db.members.remove ({email:email}, {justOne:true}, function (err, data) {

        if (err) {
            deferred.reject (err);
        } else {
            deferred.resolve (data);
        }

    });

    return deferred.promise;

};

exports.SetLostPassword =  function (key) {

    var deferred = Q.defer();

    this.GetByPromise ( {$or : [
        {email : key}, {membershipId : key}
    ]}).then(function (member) {


        if (_.isEmpty(member)) {

            deferred.resolve ({status : false});

        } else {

            // DO NOT LOCK THE ACCOUNT
            // This would be a potential DOS vector

            // reset.created is created as an ISO date so the TTL index will work to expire the document

            var reset = _.pick(member[0], ['email','membershipCode', 'firstname', 'lastname', '_id']);
            reset.created = new Date();
            reset.memberId = reset._id;
            reset = _.omit (reset, '_id');

            db.resets.insert (reset, function (err, data){

                if (err) {
                    deferred.reject ({status: false});
                } else {
                    deferred.resolve ({
                        status : true,
                        data: data
                    });
                }

            });



        }

    }, function (error) {
        deferred.reject (error);
    });

    return deferred.promise;

};

exports.GetPasswordReset = function (id) {

    var deferred = Q.defer();

    db.resets.findOne ({_id: db.ObjectId(id)}, function (err,data){
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });

    return deferred.promise;

};

function encryptPassword (password) {

    var v = encrypt.Encrypt(password);

    return {
        password : v.hashedValue,
        salt : v.salt
    }
}


exports.ResetPassword = function (id, newPassword) {

    var deferred = Q.defer();

    this.GetPasswordReset (id).then(function (data) {

        var encryptedPassword = encryptPassword(newPassword);

        update ({_id: data.memberId},
            {
                $set: {
                    password: {
                        hash : encryptedPassword.password,
                        salt : encryptedPassword.salt
                    },
                    lastUpdated : Date.now()
                }
            }
        ).then (function () {
                db.resets.remove ({_id: db.ObjectId(id)});
                deferred.resolve (data);
            }
        );

    }, function (error) {
        deferred.reject (error);
    });

    return deferred.promise;
};