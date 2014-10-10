
userApp.factory ('OrgUnits', ['$resource', function ($resource) {
    return $resource (
        '/api/ous/:id',
        {
            id : '@id'
        },
        {
            add : {
                method : "POST"
            }
        }
    );
}]);

userControllers.controller('AdminOrgUnitsController', ['$scope', 'OrgUnits',
    function ($scope, OrgUnits) {

        var defaultSpec = {
        };

        $scope.Mode = 'Browse';

        $scope.Spec = angular.copy(defaultSpec);
        $scope.SortOrder = 'name';

        $scope.Refresh = function () {
            OrgUnits.query($scope.Spec).$promise.then (function (data) {
                $scope.OrgUnits = data;
            });
        };

        $scope.SetFilter = function (f,v) {
            $scope.Spec[f]= v;
            $scope.Refresh();
        };

        $scope.OnReset = function () {
            $scope.Spec = angular.copy(defaultSpec);
            $scope.Refresh();
        };

        $scope.OnAddOU = function () {
            $scope.Mode = 'Add';
        };

        $scope.Refresh();
    }
]);

userControllers.controller('AddOrgUnitController', ['$scope', 'OrgUnits', 'Links',
    function ($scope, OrgUnits, Links) {

        $scope.OU = {};

        $scope.OnAddOU = function () {
            OrgUnits.add ({ou:$scope.OU}).$promise.then (function () {
                Links.go('/orgunits');
            });
        }

        $scope.CanSubmit = function () {
            return true;
        }



    }

]);
