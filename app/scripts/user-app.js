var userApp = angular.module ("UserApp",[
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'UserControllers',
    'RITS.services',
    'Zen.services',
    'mgcrea.ngStrap'
]);

userApp.config(['$locationProvider', function ($locationProvider) {

    // $locationProvider.html5Mode(true);

}
]);

userApp.config(['$tooltipProvider', function ($tooltipProvider) {

    angular.extend ($tooltipProvider.defaults, {
       animation : 'am-flip-x',
       trigger : 'hover',
       delay : {
           show : 500,
           hide : 100
       }
    });

}
]);

userApp.filter ('stdDate', function () {
   return function (v) {
       var m = moment (v);
       return m.format('Do MMM YYYY');
   }
});

userApp.filter ('stdDateTime', function () {
    return function (v) {
        var m = moment (v);
        return m.format('Do MMM YYYY HH:mm');
    }
});

userApp.filter ('fromNow', function () {
    return function (v) {
        var m = moment (v);
        return m.fromNow();
    }
});

userApp.filter ('titlecase', function () {
   return function (v) {

       var i, j, str, lowers, uppers;
       str = v.replace(/\b\w+/g, function(txt) {
           return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
       });

       // Certain minor words should be left lowercase unless
       // they are the first or last words in the string
       lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
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
});

userApp.service ('Members', function () {

    this.Types = function () {
        return [
            {
                option: "a student",
                value: "st"
            },
            {
                option: "teaching staff",
                value: "ts"
            },
            {
                option: "support staff",
                value: "ss"
            },
            {
                option: "a parent",
                value: "pp"
            },
            {
                option: "none of the above",
                value: "na"
            }
        ];
    }

});

var userControllers = angular.module ('UserControllers', []);


userControllers.controller('SearchController', ['$scope', '$window', '$location',
    function ($scope, $window, $location) {

        $scope.SearchScopes = [
//            {
//                title : "All",
//                prompt: "Search all indexes..."
//            },
            {
                title: "Title",
                prompt: "Search by title only"
            },
            {
                title: "Author",
                prompt: "Search by author only"
            },
            {
                title: "Publisher",
                prompt: "Search by publisher only"
            },
            {
                title: "Tags",
                prompt: "Search by tags and keywords"
            },
        ];

        $scope.SearchScope = $scope.SearchScopes[0];

        $scope.Spec = $location.search.q;



        $scope.onSearchScope = function(v) {
            $scope.SearchScope = $scope.SearchScopes[v];
        }

        $scope.OnSearch = function () {

            if ($scope.Spec.length === 0) {
                return;
            }

            $window.location.href ='/search?idx=' + $scope.SearchScope.title.toLowerCase() + '&q=' + $scope.Spec;

        }

    }
]);

userControllers.controller('NavController', ['$scope', '$location',
    function ($scope, $location) {

        $scope.NavEntries = [
//            {
//                title: '',
//                url: '',
//                href: ''
//            },
            {
                title: 'Home',
                url: '/home',
                href: '#home'
            },
            {
                title: 'Sign Up',
                url: '/signup',
                href: '#signup'
            },
            {
                title: 'Log in',
                url: '/login',
                href: '#login'
            }
        ];

        $scope.IsActive = function (viewLocation) {
            console.log (viewLocation + "^^" + $location.path());
            return viewLocation === $location.path();
        };

    }
]);

userControllers.controller('LandingController', ['$scope', '$timeout',
    function ($scope, $timeout) {
        var quotes = [
                {
                    quote : "In a good bookroom you feel in some mysterious way that you are absorbing the wisdom contained in all the books through your skin, without even opening them.",
                    who : "Mark Twain"
                },
                {
                    quote : "Whatever the cost of our libraries, the price is cheap compared to that of an ignorant nation.",
                    who : "Walter Cronkite"
                },
                {
                    quote : "So big it doesn't need a name. It's just The Library",
                    who : "The Doctor"
                },
                {
                    quote : "Libraries were full of ideas–perhaps the most dangerous and powerful of all weapons.",
                    who : "Sarah J. Maas"
                }
            ],
            delay = 10000,
            nq = 0,
            cycleQuote = function () {
                nq++;
                $scope.Quote = quotes[nq % quotes.length];
                $timeout (cycleQuote, delay);
            };


        $scope.Quote = quotes[0];
        quotes = _.shuffle(quotes);
        $timeout (function() {$timeout (cycleQuote, delay);}, delay/2);

    }
]);
