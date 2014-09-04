userControllers.controller('StockController', ['$scope', '$sce', 'Codes', 'ISBN', 'Links',
    function ($scope, $sce, Codes, ISBN, Links) {


        var i,j;

        $scope.StockCode = ___stockCode;

        ISBN.get ({isbn : ___isbn13}).
            $promise.then(function (result) {

                j = result;
                i = result.data[0];

                $scope.Details = {
                    title : j.search_title || 'Unknown',
                    author : j.search_author || '',
                    publisher : (i.publisher_name || i.publisher_text) || 'Unknown Publisher',
                    edition :  i.edition_info || '',
                    physical : i.physical_description_text || '',
                    summary : (i.summary || i.notes) || '',
                    isbn10: i.isbn10 || 'n/a',
                    isbn13: i.isbn13 || 'n/a',
                    stock_codes : j.stock_codes,
                    added : j.added
                };



            }, function () {

                Links.goHome();

            });

    }
]);
