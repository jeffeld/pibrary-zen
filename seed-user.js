
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongojs = require('mongojs'),
    _ = require ('./app/bower_components/underscore'),
    Q = require ('q'),
    moment = require ('moment'),

    minimist = require ('minimist'),
    argv = minimist(process.argv.slice(2)),


    config = require('./lib/config/config'),

    db = mongojs.connect(config.database, ['signups', 'members'])

;

function log (m) {
    console.log ([moment().format('HH:mm:ss'), m].join('\t'));
}

function getSignUps () {

    var deferred = Q.defer();

    db.signups.find({}, function (err, data) {

        if (err) {
            deferred.reject (err);
        } else {
            deferred.resolve (data);
        }
    });

    return deferred.promise;
}

function addMember (mi) {

    var deferred = Q.defer(),
        newMember = _.pick (mi, [
        'email',
        'firstname',
        'lastname',
        'role'
    ]);

    newMember.password = {
        hash : mi.password,
        salt : mi.salt
    };

    newMember.created = new Date;
    newMember.activated = new Date;
    newMember.status = 'active';
    newMember.userlevel = 1000;
    newMember.numLoans = 0;
    newMember.numVisits = 0;

    db.members.insert (newMember, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve (data);
        }
    });

    return deferred.promise;

}

function deleteSignUp (su) {

    var deferred = Q.defer();

    db.signups.remove ({_id : su._id}, true, function (err, data) {
        if (err) {
            deferred.reject (err);
        } else {
            deferred.resolve (data);
        }
    });

    return deferred.promise;
}

function seed (index) {

    var deferred = Q.defer();

    getSignUps().then(function (signups) {

        var su = signups[index];

        addMember(su).then(function () {
            deleteSignUp(su).then (function () {
                deferred.resolve (true);
            });
        });



    });


    return deferred.promise;
}

//try {

    var promises = [], p;

    console.log (['Seed-user running against the ', config.database, ' database'].join(''));

    if (_.isUndefined(argv.seed)) {

        // List signups

        p = getSignUps().then(function (signups) {

            var n = 1;

            _.each (signups, function (su) {
                console.log ([n, ') ', su.firstname, ' ', su.lastname, ' (', su.email, ') '].join(''));
                n++;
            });

        });



    } else {

        // The --seed is passed, along with an index number

        if (_.isNumber(argv.seed) && !_.isNaN(argv.seed) && argv.seed-1 >= 0) {

            p = seed (argv.seed-1).then (function () {

                log ('Seeded ok');

            });

        }

    }

    promises.push (p);

    Q.allSettled (promises).then(function () {
        process.exit (0);
    }, function (error) {
        log(error);
        process.exit (-1);
    });



//} catch (e) {
//    log (e);
//    process.exit(-2);
//}