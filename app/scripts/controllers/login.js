userControllers.controller('LoginController', ['$scope', '$timeout', '$window', 'formService',
    function ($scope, $timeout, $window, formService, SignUp) {

        $scope.Username = "";
        $scope.Password = "";

        $scope.CanSubmit = function () {

            if (LogInForm.$invalid) {
                return false;
            }

            if (_.isEmpty($scope.Username) || _.isEmpty($scope.Password)) {
                return false;
            }

            return true;

        };

        $scope.OnSubmit = function () {
            alert ("Boo!");
        };
    }
]);

