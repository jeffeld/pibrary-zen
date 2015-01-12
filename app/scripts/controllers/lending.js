userControllers.controller('LendingController', ['$scope', 'Codes', 'Links', 'Actions',
    function ($scope, Codes, Links, Actions) {

        $scope.ReturnDate = ___returnDate;
        $scope.StockId = ___stockCode;

        $scope.OnRenew = function () {

            Actions.Renew({stockid: $scope.StockId}).
                $promise.then(function (data) {
                    Links.goHome();
                }, function (error) {
                    Links.go('/500');
                }
            );

        };


        $scope.OnReturn = function () {

            Actions.Return({stockid: $scope.StockId}).
                $promise.then(function (data) {

                    Links.goBack();

                }, function (error) {

                    Links.go('/500');

                });


        };

        $scope.OnLend = function () {

            if (!Codes.isMembershipCode($scope.MembershipId)) {
                return;
            }

            Actions.Lend({stockid: $scope.StockId, membershipcode: $scope.MembershipId}).
                $promise.then(function (data) {

                    Links.goBack();

                }, function (error) {
                    Links.go('/500');
                });


        };


    }
]);

