
userApp.factory ('Emails', ['$resource', function ($resource) {
    return $resource (
        '/api/emails/:id',
        {
            id : '@id'
        }
    );
}]);


function postCommand ($scope) {

    $scope.SelectAll = false;
    $scope.Refresh();

}

userControllers.controller('AdminEmailController', ['$scope', 'Emails',
    function ($scope, Emails) {

        var defaultSpec = {
            status : 'pending'
        };

        $scope.Emails = [];
        $scope.Spec = angular.copy(defaultSpec);

        $scope.SelectAll = false;
        $scope.SortOrder = 'submitted';
        $scope.AtLeastOneError = false;

        $scope.Emails = Emails.query($scope.Spec);

        $scope.LastUpdated = function (f) {
            return angular.isDefined (f.lastupdated) ? f.lastupdated : f.submitted;
        };

        $scope.Refresh = function () {
            $scope.Emails = Emails.query($scope.Spec);
        };

        $scope.SetFilter = function (f,v) {
            $scope.Spec[f]= v;
            $scope.Refresh();
        };

        $scope.OnReset = function () {
            $scope.Spec = angular.copy(defaultSpec);
            $scope.Refresh();
        };

        $scope.OnStatusChanged = function () {
            if ($scope.Spec.status === 'all') {
                $scope.Spec = _.omit ($scope.Spec, 'status');
            }

            $scope.Refresh();
        };

        $scope.AtLeastOneSelected = function () {
            return angular.isDefined(_.findWhere ($scope.Emails, {selected : true}));
        };

        $scope.OnSelectAll = function () {
            $scope.SelectAll = !$scope.SelectAll;
            _.each($scope.Emails, function (v) {
                v.selected = $scope.SelectAll;
            });
        };

        $scope.OnResend = function () {

            _.each ($scope.Emails, function (v){

                if (v.selected) {
                    Emails.save ({id: v._id, status: "pending"}, function () {
                        // Do nothing by design
                    }, function () {
                        $scope.AtLeastOneError = true;
                    });
                }

            });

            postCommand ($scope);

        };

        $scope.OnDelete = function () {
            _.each ($scope.Emails, function (v){

                if (v.selected) {
                    Emails.delete ({id: v._id}, function () {
                        // Do nothing by design
                    }, function () {
                        $scope.AtLeastOneError = true;
                    });
                }

            });

            postCommand ($scope);


        };

    }
]);


