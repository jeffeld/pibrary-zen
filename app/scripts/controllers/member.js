userApp.factory('MemberDetails', ['$resource', function ($resource) {
    return $resource('/api/member/:id/:item', {id:"@id"}, {
        getDetails: {
            method: 'GET',
            params : {
                item: 'details'
            }

        }
    })
}]);

userControllers.controller('MemberController', ['$scope', 'MemberDetails', 'Links',
    function ($scope, MemberDetails, Links) {

        var today = new Date();

        $scope.MembershipId = ___mid;
        $scope.StockCodeToLoan = ___stockCode;

        MemberDetails.getDetails({id: $scope.MembershipId}).$promise.then (function (data){

            $scope.Details = data;

            if (angular.isDefined(data.lastLoggedIn)) {
                $scope.hasLoggedIn = true;
            }

            if (angular.isDefined(data.numLoans)) {
                $scope.hasBorrowed = true;
            }

            document.title = $scope.Details.firstname + ' ' + $scope.Details.lastname + '\'s Account';

            $scope.Loans = _.filter ($scope.Details.currentLoans, function (v) {
                return new Date(v.returnDate) >= today;
            });

            $scope.Overdues = _.filter ($scope.Details.currentLoans, function (v) {
                return new Date(v.returnDate) < today;
            });


        }, function (err) {

            if (err.status === 404) {
                Links.go('/404');
            } else {
                Links.go('/500');
            }

        });

        $scope.OnToggleShowHistory = function () {
            $scope.ShowHistory = !$scope.ShowHistory;
        };

        $scope.ShowHistory = false;
        $scope.HistoryLimit = 3;

        $scope.OnSeeAllHistory = function () {
            $scope.HistoryLimit = $scope.Details.loanHistory.length;
        };

    }
]);

userControllers.controller('LendingController', ['$scope', '$window', 'Links', 'Actions', 'Codes',
    function ($scope, $window, Links, Actions, Codes) {

        $scope.ReturnDate = ___returnDate;
        $scope.AutoLoan = ___stockCode;
        $scope.MembershipId = ___mid;

        $scope.OnLoan = function (membershipCode, stockCode) {

            Actions.Lend({stockid: stockCode, membershipcode: membershipCode}).
                $promise.then(function (data) {

                    // $window.location.reload();
                    Links.go (Links.make('/member', membershipCode));

                }, function (error) {

                    // Did we get a forbidden? Lets see why...

                    if (error) {

                        if (error.status === 403 && angular.isArray(error.data)) {

                            $scope.LoanReasons = {};

                            _.each(error.data, function (reason) {
                                $scope.LoanReasons[reason] = true;
                            });

                            var modal = $('#loanProblem');
                            modal.modal();

                        } else if (error.status === 404) {

                            var url = [Links.make ('/stock', stockCode), "&ret=", membershipCode].join('');
                            Links.go (url);

                        }


                    } else {

                        Links.go('/500');

                    }



                });

        };

        $scope.OnOverride = function (membershipCode, stockCode) {

            Actions.ForceLend({stockid: stockCode, membershipcode: membershipCode}).
                $promise.then(function (data) {
                    Links.go (Links.make('/member', membershipCode));
                }, function (error) {
                    Links.go('/500');
                }
            );

        };

        if (Codes.isStockCode($scope.AutoLoan)) {
            $scope.OnLoan ($scope.MembershipId, $scope.AutoLoan);
        }

    }
]);