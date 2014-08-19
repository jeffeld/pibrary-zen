
angular.module ('Zen.services', [])
    .factory ('Codes', function() {

        var isbnrx = /(?:97(?:8|9)\d{10})|(?:\d{9})(?:\d|x)/gi;

        return {

            isISBN: function (v) {
                var isbn = v.replace (/[\s\-]/g, '');
                return isbnrx.test(isbn);
            },

            isMembershipCode : function (v) {
                return v === '123456789';
            },

            isStockCode : function (v) {
                return v === 'STOCKCODE' || v === 'CODESTOCK';
            }


        }

})
    .factory ('Links', ['$window', function ($window) {

    return {
        make: function (path, id) {
            // return (path + '/' + id);
            return (path + "?sid=" + id);
        },

        go: function (path, message) {
            $window.location.href = path;
        },

        goHome: function () {
            $window.location.href = "/home";
        }
    }
}])
    .factory ('ZenString', function () {

        return {

            toTitleCase : function (v) {
                var i, j, str, lowers, uppers;

                if (! angular.isDefined(v)) {
                    return;
                }

                str = v.replace(/\b[\w-\']+/g , function(txt) {
                    //str = v.replace(/\b\w+(?:'s)*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });

                // Certain minor words should be left lowercase unless
                // they are the first or last words in the string
                lowers = ['A', '&Amp;', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
                    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
                for (i = 0, j = lowers.length; i < j; i++)
                    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
                        function(txt) {
                            return txt.toLowerCase();
                        });

                // Certain words such as initialisms or acronyms should be left uppercase
                uppers = ['Id', 'Tv'];
                for (i = 0, j = uppers.length; i < j; i++)
                    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
                        uppers[i].toUpperCase());

                return str;

            }
        }
}
);


