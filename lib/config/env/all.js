'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,


    // Make sure this path exists and is writeable by the
    // Node process user account

    // galleryPath: '/home/jeff/Pictures/Mugshots/',

    // ssl : {
    //     cert: 'path/to/certificate.file',
    //     key: 'path/to/server/key'
    // }



    orac: {

        // URL to the Orac REST service. This is the default and there is usually no need
        // to change it.

        path: process.env.ORAC_API_PATH || 'http://localhost:9000/api/v1/'
    },

    notWorkDays: [0, 6],

    defaultLoanInDays: 21,

    emailer: {

        // Options for the email.js script
        // Alternatively, you can specify them on the command line.
        // e.g.
        // --database production-db
        // --password G#jW$b09*6z


        // The username and password of the Gmail account being used

        // user : 'gmail user id',
        // password : 'password'

        // How you want your from line to appear in the emails

        // from: 'Pipers Hill Library <phcollibrary@gmail.com>',

        // The email account to send all emails to (regardless of intended recipient) when testing (i.e. live === false)

        // safeRecipient: 'test-recipient@gmail.com',

        // Default to testing mode. Either set this to true in local.js or specify --live on the command line

        live : false
    },

    // Messages used on the landing page. Override in locals.js to provide your own.
    landing : {
        heading: 'Welcome to The Library',
        p1: 'Main intro heading here',
        p2: 'By line here',
        p3: 'Small message here'
    }

};