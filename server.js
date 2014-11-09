'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var https = require('https'),
    http = require('http'),
    fs = require('fs'),
    express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    _ = require ('./app/bower_components/underscore'),
//    monogodb = require('mongodb'),
//    mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10,
    mongojs = require ('mongojs'),
    membersdb = require('./lib/modules/membersdb')
;

var isMembershipNumber = function (v) {
    var memberrx = /^B{1}\d{6}$/i;
    return memberrx.test(v);
};

/**
 * Main application file
 */

// Application Config

var config = require('./lib/config/config');

// Ensure all the required indexes are created
var db = mongojs.connect(config.database, ["signups"]);
db.signups.ensureIndex({email : 1}, {unique : true});


//// Bcrypt middleware
//userSchema.pre('save', function(next) {
//    var user = this;
//
//    if(!user.isModified('password')) return next();
//
//    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//        if(err) return next(err);
//
//        bcrypt.hash(user.password, salt, function(err, hash) {
//            if(err) return next(err);
//            user.password = hash;
//            next();
//        });
//    });
//});
//
//// Password verification
//userSchema.methods.comparePassword = function(candidatePassword, cb) {
//    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//        if(err) return cb(err);
//        cb(null, isMatch);
//    });
//};
//
//// Seed a user
//var User = mongoose.model('User', userSchema);
//
//var user = new User({ username: 'ensor', email: 'ensor@orac.com', password: 'tarial' });
//mongoose.connect('localhost', 'test');
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function callback() {
//    console.log('Connected to DB');
//});
//
//// User Schema
//var userSchema = mongoose.Schema({
//    username: { type: String, required: true, unique: true },
//    email: { type: String, required: true, unique: true },
//    password: { type: String, required: true},
//});
//user.save(function(err) {
//    if(err) {
//        console.log(err);
//    } else {
//        console.log('user: ' + user.username + " saved.");
//    }
//});

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.email);
});

passport.deserializeUser(function(id, done) {

    var deserialize = function (data) {
        var user = _.omit (data, ['_id', 'password']);
        user.userlevel = user.userlevel || 0;
        done (null, user);
    },
        errorHandler = function (err) {
            done (err, id);
        };

    if (isMembershipNumber(id)) {
        membersdb.FindByMembershipId (id, deserialize, errorHandler);
    } else {
        membersdb.FindByEmail(id, deserialize, errorHandler);
    }

});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.
passport.use(new LocalStrategy(function (username, password, done) {

    var compare = function (data) {

            if (_.isObject(data) && _.isEmpty(data)) {
                return done(null, false, {
                    message: 'Unknown username or password'
                });
            }

            var user = data;

            membersdb.ComparePassword(user._id.toString(), password, function (isSame) {
                 if (isSame) {
                    return done(null, user);
                }

                return done(null, false, {
                    message: 'Unknown username or password'
                });

            }, function () {
                return done(err);
            })

        },
        errorHandler = function (err) {
            return done(err);
        };

    if (isMembershipNumber(username)) {
        membersdb.FindByMembershipId (username, compare, errorHandler);
    } else {
        membersdb.FindByEmail(username, compare, errorHandler);
    }



}));

var app = express();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app, config);

// Application Event Management
require('./lib/appevents');


//var app2 = express();
//app2.get('*', function(req,res) {
//    if (!req.secure) {
//        res.redirect(['https://', req.get('Host'), req.url].join(''));
//    }
//});
//
//http.createServer(app2).listen(8080);


// Start server

if (_.isUndefined(config.ssl)) {

    app.listen(config.port, function () {
        console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
    });

} else {

    var options = {
        key : fs.readFileSync(config.ssl.key),
        cert: fs.readFileSync(config.ssl.cert),
        requestCert: false,
        rejectUnauthorized: false
    };

    https.createServer(options,app).listen(config.port, function () {
        console.log('Express HTTPS server listening on port %d in %s mode', config.port, app.get('env'));
    });

}


// Expose app
exports = module.exports = app;