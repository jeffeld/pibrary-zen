'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,


    // Make sure this path exists and is writeable by the
    // Node process user account

    galleryPath: '/home/jeff/Pictures/Mugshots/',

    orac: {
        path: 'http://localhost:9000/api/v1/'
    },

    notWorkDays: [0, 6],

    defaultLoanInDays: 21



};