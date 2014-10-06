userApp.factory ('StockCodes', ['$resource', function ($resource) {
    return $resource ('/api/stockcodes/:quantity', {quantity: '@quantity'});
}]);


userControllers.controller('StockCodesController', ['$scope', 'StockCodes', 'Links',
    function ($scope, StockCodes, Links) {

        var calculateTotal = function () {
            switch ($scope.Method.value) {
                case 'total':
                    return $scope.Total;
                case 'rcp':
                    return $scope.CalculateRCP();
                case 'cpp':
                    return $scope.CalculateCPP();
            }
        };


        $scope.MaxCodes = 4096;

        $scope.Method = {name:''};

        $scope.Methods = [
            {name:'Enter a total', value:'total'},
            {name:'Calculate total from rows, columns and pages', value:'rcp'},
            {name:'Calculate total from codes per page and pages', value:'cpp'}
        ];

        $scope.GetCodes = function () {

            var quantity = 345;

            StockCodes.get({quantity: quantity});
        };


        $scope.CanSubmit = function () {

            switch ($scope.Method.value) {
                case 'total':
                    return ! isNaN(parseInt($scope.Total));

                case 'rcp':
                    return ! isNaN($scope.CalculateRCP());

                case 'cpp':
                    return ! isNaN($scope.CalculateCPP());
            }

            return false;

        };

        $scope.CalculateRCP = function () {
            return $scope.Rows * $scope.Columns * $scope.Pages;
        };

        $scope.isRCPAN = function () {
            return ! isNaN($scope.CalculateRCP());
        };

        $scope.CalculateCPP = function () {
            return $scope.CodesPerPage * $scope.Pages2;
        };

        $scope.isCPPAN = function () {
            return ! isNaN($scope.CalculateCPP());
        };

        $scope.MakeDownloadLink = function () {
            return "/api/stockcodes/" + calculateTotal();
        };


    }
]);