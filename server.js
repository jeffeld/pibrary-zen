'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
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

    membersdb.FindByEmail (id, function (data) {

        var user = _.omit (data[0], ['_id', 'password']);
        user.userlevel = user.userlevel || 0;
        done (null, user);

    }, function (err) {

       done (err, id);

    });



});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.
passport.use(new LocalStrategy(function(username, password, done) {

    membersdb.FindByEmail (username, function (data){


        if (_.isObject(data) && _.isEmpty(data)) {
            return done (null, false, {
                message : 'Unknown username or password'
            });
        }

        var user = data[0];

        membersdb.ComparePassword (user._id.toString(), password, function (isSame) {
            if (isSame) {
                return done (null, user);
            }

            return done (null, false, {
                message : 'Unknown username or password'
            });

        }, function () {
            return done (err);
        })

    }, function (err) {
        return done (err);
    });



//    User.findOne({ username: username }, function(err, user) {
//        if (err) { return done(err); }
//        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
//        user.comparePassword(password, function(err, isMatch) {
//            if (err) return done(err);
//            if(isMatch) {
//                return done(null, user);
//            } else {
//                return done(null, false, { message: 'Invalid password' });
//            }
//        });
//    });
}));

var app = express();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app, config);

// Application Event Management
require('./lib/appevents');

// Start server
app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;