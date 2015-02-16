/**
 * Created by jeff on 26/01/15.
 */

var database = 'library-dev',
    mongojs = require('mongojs'),
    db = mongojs.connect(database, ['signups', 'members']);

function resetDatabase () {

  console.log ("Resetting database!");

  db.signups.remove({});
  db.members.remove({membershipCode: {$regex: /[0-9a-f]{8}\-/}});

}


module.exports = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  baseUrl: 'https://localhost:3000',

  allScriptsTimeout : 60 * 1000,

  multiCapabilities: [
    {
      browserName: 'chrome'
    },
    //{
    //  browserName: 'chromium'
    //},
    //{
    //  browserName: 'firefox'
    //}

  ],

  suites: {
    //login: ['login/**/*-tests.js'],
    // prime: ['prime/**/*-tests.js'],
    signup: ['signup/**/password-tests.js']
    // complete: ['complete/**/e2e.js']

  },

  beforeLaunch: function() {

    resetDatabase();

  }

};

