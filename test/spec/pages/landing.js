//
//
//// var page = require('webpage').create();
//
//var page = PhantomJS.webpage;
//
//
//
//page.open('http://www.bbc.com/news', function (status){
//    console.log(status);
//    if (status === 'success') {
//        console.log(page.title);
//    } else {
//        console.log ("failed");
//    }
//
//    phantom.exit(0);
//});



define(['webpage'], function (webpage) {

    describe("Landing Page", function () {


        it("should load", function () {

            webpage.open ('http://www.bbc.com/news', function (status) {
                console.log (status);
            });


        });

    });
});
