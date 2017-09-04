
// Using GMail? Keeps erroring and you've enabled Less Secure Apps? Then...
// In addition to enabling Allow less secure apps, you might also need to navigate to
// https://accounts.google.com/DisplayUnlockCaptcha and click continue.

// This instructs Google not to require a captcha.
// Taken from this article: https://stackoverflow.com/questions/26196467/sending-email-via-node-js-using-nodemailer-is-not-working


process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const nodemailer  = require('nodemailer');
const mongojs     = require('mongojs');
const _           = require('./app/bower_components/underscore/underscore');
const Q           = require('q');
const moment      = require('moment');
const minimist    = require('minimist');
const argv        = minimist(process.argv.slice(2));
const config = {
    database: process.env.MONGODB,
    emailer: {
        user: process.env.GMAIL_USER_ID,
        password: process.env.GMAIL_PASSWORD,

        // How you want your from line to appear in the emails

        from: process.env.GMAIL_FROM, // 'Pipers Hill Library <phcollibrary@gmail.com>',

        // The email account to send all emails to (regardless of intended recipient) when testing (i.e. live === false)

        safeRecipient: process.env.SAFE_EMAIL_RECIPIENT, // 'test-recipient@gmail.com',

        // Default to testing mode. Either set this to true in local.js or specify --live on the command line

        live: true, // process.env.NODE_ENV === "production",

    }
};

const AWS = require ('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,

    region: process.env.AWS_SES_REGION
});


const db = mongojs(config.database, ['emails']);

let transporter = {};

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
            log(["error", err.message].join('\t'));
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

    const now = new Date();

    try {
        const x = mongojs(config.database, ['emails']);
        const rc = x.emails.updateOne(
            {_id: email._id},
            // {_id: db.ObjectId("59a3c7f593c0f400117af19a")},
            {

                $set: {
                    status: status,
                    lastUpdated: now

                }
                ,

                $push: {
                    activity: {
                        date: now,
                        status:
                        status,
                        data:
                        data
                    }
                }

            });

        log (rc);

    }
    catch (e) {
        log (e)
    }


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

    // config.emailer.live = config.emailer.live || false;

    log (['info', 'Running in ' + (config.emailer.live ? 'LIVE' : 'TEST') + ' mode'].join('\t'));

    // Create the mail transporter object.

    transporter = nodemailer.createTransport({
        // service: 'Gmail',
        // auth: {
        //     user : config.emailer.user,
        //     pass : config.emailer.password
        // }

        SES: new AWS.SES({
            apiVersion: '2010-12-01'
        })


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

