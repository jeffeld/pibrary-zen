userControllers.controller('LendingController', ['$scope', 'Codes', 'Links', 'Actions',
    function ($scope, Codes, Links, Actions) {

        $scope.ReturnDate = ___returnDate;

        $scope.OnRenew = function () {

            Actions.Renew({stockid: 'STOCKCODE'}).
                $promise.then(function (data) {

                    Links.goHome();

                }, function (error) {

                });


        };


        $scope.OnReturn = function () {

            Actions.Return({stockid: 'STOCKCODE'}).
                $promise.then(function (data) {

                    Links.goHome();

                }, function (error) {

                });


        };

        $scope.OnLend = function () {

            if (!Codes.isMembershipCode($scope.MembershipId)) {
                return;
            }

            Actions.Lend({stockid: 'STOCKCODE', membershipcode: $scope.MembershipId}).
                $promise.then(function (data) {

                    Links.goHome();

                }, function (error) {

                });


        };


    }
]);

