
userControllers.controller('StockAddController', ['$scope', 'Codes', 'ISBN', 'formService', 'Links',
    function ($scope, Codes, ISBN, formService, Links) {

        $scope.StockCode = ___id;
        $scope.Details = null;

        $scope.OnAddItem = function () {





        }

        $scope.OnCancel = function () {

            Links.go ('/home', {text : 'Adding of stock code ' + $scope.StockCode + ' cancelled', type: 'warning'})

        }

        $scope.CanSubmit = function () {

            if ($scope.Details === null ) {
                return false;
            }

            var mustHaveLengths  = [$scope.Details.title, $scope.Details.author, $scope.Details.publisher];
            if (! formService.hasNonZeroLength(mustHaveLengths)) {
                return false;
            }

            return true;

        }

        $scope.OnISBN = function () {

            if (! Codes.isISBN($scope.ISBN)) {
                return;
            }

            ISBN.get({ isbn: $scope.ISBN}).
                $promise.then(function (result) {

                if (result.hasOwnProperty('index_searched')) {
                    var d = result.data[0];
                    $scope.Details = {
                        title : d.title || d. title_latin || d.title_long,
                        author : d.author_data[0].name || '',
                        publisher : d.publisher_name || d.publisher_text || '',
                        summary : d.summary || '',
                        isbn10 : d.isbn10 || '',
                        isbn13 : d.isbn13 || '',
                        edition : d.edition_info
                    }
                } else {
                    $scope.Details = ISBN.search({ isbn: $scope.ISBN}).
                        $promise.then(function (result2) {
                            var d = result2.data[0];

                            $scope.Details = {
                                title : d.title || d. title_latin || d.title_long,
                                author : d.author_data[0].name || '',
                                publisher : d.publisher_name || d.publisher_text || '',
                                summary : d.summary || '',
                                isbn10 : d.isbn10 || '',
                                isbn13 : d.isbn13 || '',
                                edition : d.edition_info
                            }

                        }, function () {
                            $scope.Details = {};
                        });
                }

            }, function () {
                // Failure, so just supply an empty object
                $scope.Details = {};
            });


        }




    }
]);
