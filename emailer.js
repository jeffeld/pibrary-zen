#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var nodemailer = require ('nodemailer'),
    mongojs = require('mongojs'),
    _ = require ('./app/bower_components/underscore/underscore'),
    Q = require ('q'),
    moment = require ('moment'),

    // config = require ('./lib/config/config') || {},

    minimist = require ('minimist'),
    argv = minimist(process.argv.slice(2)),


    transporter = {},


    config = {
        database: process.env.MONGODB,
        emailer: {
            user : process.env.GMAIL_USER_ID, // 'gmail user id',
            password : process.env.GMAIL_PASSWORD, // 'password'

            // How you want your from line to appear in the emails

            from: process.env.GMAIL_FROM, // 'Pipers Hill Library <phcollibrary@gmail.com>',

            // The email account to send all emails to (regardless of intended recipient) when testing (i.e. live === false)

            safeRecipient: process.env.SAFE_EMAIL_RECIPIENT, // 'test-recipient@gmail.com',

            // Default to testing mode. Either set this to true in local.js or specify --live on the command line

            live : false

        }
    },

    db = mongojs(config.database, ['emails'])

;

function log (m) {
    console.log ([moment().format('HH:mm:ss'), m].join('\t'));
}

function getEmails () {

    // Get all pending emails from the database.
    // Pending means "waiting to be sent".

    var deferred = Q.defer();

    db.emails.find ({status: 'pending'}, function (err, emails) {

        if (err) {
            deferred.reject (err);
        } else {
            deferred.resolve (emails);
        }

    });

    return deferred.promise;
}

function send (email) {

    // Submit the email to the server.
    // Reject or resolve the promise and pass any
    // information returned from the server

    var deferred = Q.defer(),
        mo = {
            to: config.emailer.live ? email.to : config.emailer.safeRecipient,
            from: config.emailer.from,
            subject: email.subject,
            html: email.body
        };

    transporter.sendMail (mo, function (err, response) {
        if (err) {
            deferred.reject (err);
        } else {
            deferred.resolve (response);
        }
    });

    return deferred.promise;
}

function updateEmail (email, data, status) {

    // Log the status and update the database entry with
    // success or failure, and the return from the email
    // server (which my prove useful when troubleshooting)

    log ([status, email.to, email.subject].join('\t'));

    var ts = new Date();
    db.emails.update ({_id: email._id}, {

        $set: {
            status: status,
            lastUpdated: ts
        },

        $push: {
            activity: {
                date: ts,
                status: status,
                data: data
            }
        }

    });

}

try {

    // Create our configuration object from config files
    // and command line parameters. Check that we have
    // all mandatory settings, otherwise we can't run properly!

    // config.emailer = _.extend (config.emailer, argv);
    //
    // var mandatoryArgs = [
    //     'user',
    //     'password',
    //     'from'
    // ];
    //
    // if (_.some (mandatoryArgs, function (v) {
    //     var b = _.isUndefined(config.emailer[v]);
    //     if (b) {
    //         log (['ERROR', 'Missing argument or setting: ' + v].join('\t'));
    //     }
    //     return b
    // })) {
    //     process.exit (-1);
    // }

    config.emailer.live = config.emailer.live || false;

    log (['info', 'Running in ' + (config.emailer.live ? 'LIVE' : 'TEST') + ' mode'].join('\t'));

    // Create the mail transporter object.

    transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user : config.emailer.user,
            pass : config.emailer.password
        }
    });

    // Get all pending emails, iterate through them and send

    getEmails().then(function (emails) {

        log (['info', emails.length + ' emails to send'].join('\t'));

        var promises = [], p;

        _.each (emails, function (email) {

            p = send (email).then(function (response) {
                updateEmail (email, response, 'sent');
            }, function (error) {
                updateEmail (email, error, 'error');
            });

            promises.push (p);

        });

        // When all of the emails have been sent (or registered an error),
        // quit the script

        Q.allSettled (promises).then(function () {
            process.exit (0);
        }, function (error) {
            log(error);
            process.exit (-1);
        });

    }, function (error) {
        log (error);
        process.exit(-1);
    });



} catch (e) {
    log (e);
    process.exit(-2);
}

