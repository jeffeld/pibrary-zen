var adminApp = angular.module ("AdminApp",[
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'UserControllers'
]);


adminApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/signup', {
                templateUrl: 'partials/code.html',
                controller: 'CodeController'
            }).
            otherwise({
                redirectTo: 'http://news.bbc.co.uk'
            });
    }]);


var userControllers = angular.module ('UserControllers', []);

//userControllers.controller('NavController', ['$scope',
//    function ($scope) {
//
//    }
//]);

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
