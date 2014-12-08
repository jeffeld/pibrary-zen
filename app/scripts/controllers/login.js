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

        };

        // Right, this is bloody weird!
        // The code below will give an error in the console, onkeypress is undefined.
        // However, the function gets called (possibly) and we get the behaviour we want;
        // that is, pressing enter in the username field, puts focus on the password field.

        $('#username').onkeypress(function(e) {
            if (e === 13) {
                $('#password').focus();
            }
        });

    }
]);

