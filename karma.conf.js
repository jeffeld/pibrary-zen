// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: './',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],


    // reporters

    reporters: ['progress'], // , 'html'],

//    htmlReporter : {
//        outputFile : 'test/tests.html'
//    },
//
//    htmlReporter : {
//        outputDir: 'karma_html',
//        templatePath: '/media/jeff/GIGANDAHALF/WebstormProjects/library/zen/node_modules/karma-html-reporter/jasmine_template.html'
//    },

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-strap/dist/angular-strap.min.js',
      'app/bower_components/angular-strap/dist/angular-strap.tpl.min.js',
      'app/bower_components/underscore/underscore.js',
      'app/bower_components/moment/moment.js',
      'app/scripts/user-app.js',
      'app/scripts/ritsservices.js',
      'app/scripts/zenservice.js',

//      'app/scripts/*.js',
//      'app/scripts/**/*.js',
//      'test/mock/**/*.js',
      'test/spec/**/*.js'

//      'test/test-main.js'


    ],

    // list of files / patterns to exclude
    exclude: [
        'test/spec/pages/*.js'
    ],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

      plugins: [
          'karma-jasmine',
          'karma-chrome-launcher',
          'karma-firefox-launcher',
          'karma-phantomjs-launcher'
      ]

  });
};
