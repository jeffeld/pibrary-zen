
userControllers.controller('StockAddController', ['$scope', '$q', '$log', 'Codes', 'ISBN', 'Stock', 'formService', 'Links', 'Search',
    function ($scope, $q, $log, Codes, ISBN, Stock, formService, Links, Search) {

        $scope.StockCode = ___id;
        $scope.ReturnUrl = Codes.isMembershipCode(___ret) ? Links.make ('/member', ___ret, '&loan=' + $scope.StockCode) : Links.home();
        $scope.Details = null;
        $scope.ISBN = '';

        $scope.Mode = 'input';

        $scope.OnAddItem = function (manualEntry) {

            var addStockItem = function () {
                $scope.Mode = 'waiting';
                Stock.add({stockid: $scope.StockCode, isbn: $scope.ISBN}).$promise.then(function () {
                    Links.go($scope.ReturnUrl);
                }, function () {
                    Links.go('/500');
                });
            };

            if (manualEntry) {

                ISBN.add({isbn: $scope.ISBN, book: $scope.Details}).$promise.then(function () {
                    addStockItem();
                }, function () {
                    Links.go('/500');
                });

            } else {
                addStockItem();
            }


        };

        $scope.OnCancel = function () {
            Links.goHome();
        };

        $scope.CanSubmit = function () {

            if ($scope.Details === null ) {
                return false;
            }

            var mandatoryFields  = [$scope.Details.title, $scope.Details.author, $scope.Details.publisher_name];
            if (! formService.hasNonZeroLength(mandatoryFields)) {
                return false;
            }

            return true;

        };

        $scope.OnISBN = function () {

            if (! Codes.isISBN($scope.ISBN)) {
                return;
            }

            // First we see if Orac has the ISBN details cached...

            $scope.Mode = 'waiting';

            Search.isbn({item: $scope.ISBN}).
                $promise.then(function (result) {

                if (result.hasOwnProperty('book')) {

                    // Orac did have the details

                    $scope.Details = result.book;
                    $scope.OnAddItem(false);

                } else {

                    // Orac didn't have the details, so direct it to look at it's
                    // external sources of information.

                    Search.isbnFromExternal({item: $scope.ISBN}).
                        $promise.then(function (result2) {

                            if (angular.isDefined(result2.book)) {

                                // Orac found the results from one of its external sources.
                                // They are now cached in its database, and have been returned
                                // to use here.

                                $scope.Details = result2.book;
                                $scope.OnAddItem(false);

                            } else {
                                $scope.Mode = 'input';
                                $scope.Details = {};
                            }

                        }, function () {

                            // Orac didn't find it externally, so set the Details
                            // object to empty. This will trigger manual entry
                            // by the user.

                            $scope.Mode = 'input';
                            $scope.Details = {};

                        });
                }

            }, function () {

                // Failure, so just supply an empty object triggering manual entry

                $scope.Mode = 'input';
                $scope.Details = {};
            });


        };

        $scope.IsBadISBN = function (v) {

           if (v.length === 10 || v.length === 13) {
               return !Codes.isISBN(v);
           }

           if (v.length > 13) {
               return true;
           }

           return false;
        };

    }
]);
