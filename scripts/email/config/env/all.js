
module.exports = {

// Pretty much all of these options should be specified in local.js.
// Alternatively, you can specify them on the command line.
// e.g.
// --database production-db
// --password G#jW$b09*6z

//  This should be the name of the MongoDB database where your emails are stored

    // database: 'database-name',

// The username and password of the Gmail account being used

    // user : 'gmail user id',
    // password : 'password'

// How you want your from line to appear in the emails

    // from: 'Pipers Hill Library <phcollibrary@gmail.com>',

// The email account to send all emails to (regardless of intended recipient) when testing (i.e. live === false)

    // safeRecipient: 'test-recipient@gmail.com',


// Default to testing mode. Either set this to true in local.js or specify --live on the command line

    live : false
};

