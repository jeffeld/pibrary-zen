var userApp = angular.module ("UserApp",[
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'UserControllers',
    'RITS.services',
    'Zen.services',
    'mgcrea.ngStrap',
    'webcam'
]);

userApp.config(['$locationProvider', function ($locationProvider) {

    // $locationProvider.html5Mode(true);

}
]);

userApp.config(['$tooltipProvider', function ($tooltipProvider) {

    angular.extend($tooltipProvider.defaults, {
        animation: 'am-fade',
        trigger: 'hover',
        delay: {
            show: 500,
            hide: 100
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

userApp.filter ('fullDate', function () {
   return function (v) {
       var m = moment (v);
       return m.format('dddd Do MMMM YYYY');
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

userApp.filter ('titlecase', ['ZenString', function (ZenString) {
   return function (v) {
       return ZenString.toTitleCase (v);
   }
}]);

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

userApp.factory('ISBN', ['$resource', function ($resource) {
    return $resource('/api/isbn/:isbn', {
            isbn: '@isbn'
        },
        {
            add : {
                method: 'PUT'
            }
        });
}]);

userApp.factory('Search', ['$resource', function ($resource) {

    var transformISBNResponse = function (data, headers) {

        var j = {},
            i = {},
            o = {};

        try {
            j = angular.fromJson(data);
        } catch(e) {
            return o;
        }

        if (angular.isDefined(j.data)) {
            i=j.data[0];
            o = {
                book : {
                    title : j.search_title || 'Unknown',
                    author : j.search_author || '',
                    publisher : (i.publisher_name || i.publisher_text) || 'Unknown Publisher',
                    edition :  (i.edition_info || '') + ' ' + (i.physical_description_text || '') + ' ' + i.notes,
                    summary : i.summary || '',
                    isbn10: i.isbn10 || 'n/a',
                    isbn13: i.isbn13 || 'n/a',
                    stock_codes : j.stock_codes || [],
                    added : j.added
                },

                raw : j
            };
        }


        return o;
    };


    return $resource('/api/search/:index/:item', {
            index: '@index',
            item: '@item'
        },
        {
            isbn: {
                method: 'GET',
                isArray: false,
                params: {
                    index: 'isbn'
                },
                transformResponse : transformISBNResponse
            },
            isbnFromExternal: {
                method: 'POST',
                isArray: false,
                params: {
                    index: 'isbn'
                },
                transformResponse : transformISBNResponse
            },
            stock: {
                method: 'GET',
                isArray: false,
                params: {
                    index: 'stock'
                }
            }
        });
}]);

userApp.factory('Stock', ['$resource', function ($resource) {
    return $resource('/api/stock/:stockid/:isbn', {
            stockid: '@stockid',
            isbn: '@isbn'
        },
        {
            add: {
                method: 'PUT',
                isArray: false
            }
        });
}]);

userApp.factory('Actions', ['$resource', function ($resource) {
    return $resource('/api/:action/:stockid/:membershipcode', {
            action: '@action',
            stockid: '@stockid',
            membershipcode: '@membershipcode'
        },
        {
            Lend: {
                method: 'PUT',
                isArray: false,
                params: {
                    action: 'lend'
                }
            },
            Return: {
                method: 'PUT',
                isArray: false,
                params: {
                    action: 'return'
                }
            },
            Renew: {
                method: 'PUT',
                isArray: false,
                params: {
                    action: 'renew'
                }
            }
        });
}]);


userApp.directive('loading', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
        },

        template: "<img src='images/loader.gif' alt='Loading'>",

        controller: function ($scope, $rootScope) {
        }
    }
})

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
