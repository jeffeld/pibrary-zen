/**
 * Created by jeff on 26/01/15.
 */



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
    // login: ['login/**/*-tests.js'],
    prime: ['prime/**/*-tests.js'],
    signup: ['signup/**/*-tests.js']
  }

};

