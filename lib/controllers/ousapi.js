var config = require ('../config/config'),
    _ = require('../../app/bower_components/underscore');


var ous = [
    {
        _id: 1,
        name: "OU " + _.random (20,2000),
        contact : "John Smith",
        email : "johnsmith@gmail.com",
        maxLoans : _.random (10,100),
        members : new Array(_.random(3,45)),
        created : Date().now,
        lastUpdated : Date().now
    },
    {
        _id: 2,
        name: "OU " + _.random (20,2000),
        contact : "John Smith",
        email : "johnsmith@gmail.com",
        maxLoans : _.random (10,100),
        members : new Array(_.random(3,45)),
        created : Date().now,
        lastUpdated : Date().now
    },
    {
        _id: 3,
        name: "OU " + _.random (20,2000),
        contact : "John Smith",
        email : "johnsmith@gmail.com",
        maxLoans : _.random (10,100),
        members : new Array(_.random(3,45)),
        created : Date().now,
        lastUpdated : Date().now
    },
    {
        _id: 4,
        name: "OU " + _.random (20,2000),
        contact : "John Smith",
        email : "johnsmith@gmail.com",
        maxLoans : _.random (10,100),
        members : new Array(_.random(3,45)),
        created : Date().now,
        lastUpdated : Date().now
    },
    {
        _id: 5,
        name: "OU " + _.random (20,2000),
        contact : "John Smith",
        email : "johnsmith@gmail.com",
        maxLoans : _.random (10,100),
        members : new Array(_.random(3,45)),
        created : Date().now,
        lastUpdated : Date().now
    }
];

exports.GetAll = function (req, res) {

    res.send (200, ous);

};

exports.Get = function (req, res) {
    res.send (200);
};

exports.Add = function (req, res) {
    res.send (200);
};

exports.Delete = function (req, res) {
    res.send (200);
};



