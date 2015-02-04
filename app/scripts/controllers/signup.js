
function isStudent (v) {
    return v === 'st';
}

function isOther (v) {
    return v === 'na';
}


userApp.factory ('SignUp', ['$resource', function ($resource) {
    return $resource (
        '/api/signups/:id',
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

// userControllers is declared in scripts/user-app.js

userControllers.controller('SignUpController', ['$scope', '$timeout', '$window', 'formService', 'SignUp',
    function ($scope, $timeout, $window, formService, SignUp) {

        var modal = {},
            modalOptions = {},
            uc = /[A-Z]+/,
            lc = /[a-z]+/,
            nc = /[0-9]+/,
            sc = /[\!\@\#\$\%\^\&\*\(\)\_\+]+/;



        $scope.Types = [
            {
                option: "a student",
                value : "st"
            },
            {
                option: "staff",
                value : "ts"
            },
            {
                option : "a parent",
                value: "pp"
            },
            {
                option : "none of the above",
                value: "na"
            }
        ];

        $scope.Step = 'signup';

        $scope.Type = {};

        $scope.AgreeTnC = false;
        $scope.AgreeRespect = false;
        $scope.AgreePhoto = false;

        $scope.FirstName = '';
        $scope.LastName = '';
        $scope.Email1 = '';
        $scope.Email2 = '';
        $scope.Mobile1 = '';
        $scope.Mobile2 = '';
        $scope.Password1 = '';
        $scope.Password2 = '';
        $scope.Other = '';

        $scope.ShowPassword = false;
        $scope.Password = {
            HasValidLength : false,
            HasAtLeastOneUppercase : false,
            HasAtLeastOneLowercase : false,
            HasAtLeastOneNumber : false,
            HasAtLeastOneSymbol : false
        };

        $scope.IsValidMobileNumber = function (v) {
            var rx = /^08\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d$/;
            return rx.test(v);
        }

        $scope.CanSubmit = function () {

            // Form must be valid

            if (SignUpForm.$invalid) {
                return false;
            }


            // Must have agreed to T&C's

            if (! $scope.AgreeTnC) {
                return false;
            }

            if (! $scope.AgreeRespect) {
                return false;
            }

            if (! $scope.AgreePhoto) {
                return false;
            }

            // Must have valid email addresses in the email fields.
            // The scope variables will be undefinded if the strings aren't valid emails

//            if (_.isUndefined ($scope.Email1) || _.isUndefined ($scope.Email2)) {
//                return false;
//            }

            // Must have identified who they are. Teacher, student etc.

            if (_.isEmpty($scope.Type)) {
                return false;
            }


            // If they've chosen Other, then a description must be supplied

            if (isOther($scope.Type.value) && $scope.Other.length === 0) {
                return false;
            }

            // So finally, a complete name, matching email addresses and passwords must be supplied.
            // We're checking this here explicity, as the 'required' attribute on the form controls
            // only kicks in when the submit button is pressed; but we want to control the disabled
            // state of the button explicitly.

            var mustHaveLengths = [$scope.FirstName, $scope.LastName, $scope.Email1, $scope.Password1, $scope.Mobile1];
            if (! formService.hasNonZeroLength(mustHaveLengths)) {
                return false;
            }


            if ($scope.Email1 !== $scope.Email2) {
                return false;
            }

            if (! formService.isValidPassword($scope.Password1)) {
                return false;
            }

            if ($scope.Password1 !== $scope.Password2) {
                return false;
            }

            if (!$scope.IsValidMobileNumber($scope.Mobile1) || ($scope.Mobile1 !== $scope.Mobile2)) {
                return false;
            }

            if ($scope.Mobile1 !== $scope.Mobile2) {
                return false;
            }


            return true;
        };

        $scope.OnSubmit = function () {

            $scope.Step = 'waiting';

            if (isOther($scope.Type.value)) {
                $scope.Type.misc = $scope.Other
            }

            var data = {
                firstname : $scope.FirstName,
                lastname : $scope.LastName,
                password1 : $scope.Password1,
                password2 : $scope.Password2,
                email1 : $scope.Email1,
                email2 : $scope.Email2,
                mobile1: $scope.Mobile1,
                mobile2: $scope.Mobile2,
                role : $scope.Type
            };

            SignUp.save({}, data, function (data, headers) {
                    //modal = $('#success');
                    // modal.modal()
                    $scope.Step = 'success';
                },
                function (err) {
                    if (err.status === 400) {
                        //modal = $('#error-email');
                        // modal.modal (modalOptions)
                        $scope.Step = 'error-email';
                    } else {
                        //modal = $('#error');
                        //modal.modal (modalOptions);
                        $scope.Step = 'error';
                    }
                });

        };

        $scope.OnTryAgain = function () {
            // modal.modal('hide');
            $scope.Step = "signup";
        };

        $scope.OnContinueAfterEmailError = function () {
            $scope.Email1 = $scope.Email2 = '';
            $('#email1').focus();
            $scope.OnTryAgain();
        };

        $scope.OnSuccess = function () {
            // modal.modal('hide');
            $window.location.href = '/home';
        };

        $scope.isBadEmail = function () {

            if (!angular.isDefined($scope.Email1) || (!angular.isDefined($scope.Email2))) {
                return false;
            }

            if ($scope.Email1.length === 0 || $scope.Email2.length === 0) {
                return false;
            }

            return $scope.Email1 !== $scope.Email2;
        };

        $scope.isBadMobile = function () {

            if (!angular.isDefined($scope.Mobile1) || (!angular.isDefined($scope.Mobile2))) {
                return false;
            }

            if ($scope.Mobile1.length === 0 || $scope.Mobile2.length === 0) {
                return false;
            }


            if (! $scope.IsValidMobileNumber($scope.Mobile1) || ! $scope.IsValidMobileNumber($scope.Mobile2)) {
                return true;
            }

            return $scope.Mobile1 !== $scope.Mobile2;

        }

        $scope.isBadPassword = function () {

            if (!angular.isDefined($scope.Password1) || (!angular.isDefined($scope.Password2))) {
                return false;
            }

            if ($scope.Password1.length === 0 || $scope.Password2.length === 0) {
                return false;
            }

            if (! formService.isValidPassword($scope.Password1)) {
                return true;
            }

            return $scope.Password1 !== $scope.Password2;



        };

        $scope.ShowHidePassword = function () {
            $scope.ShowPassword = !$scope.ShowPassword;
        };

        $scope.OnPasswordChange = function () {

            var v = angular.isDefined ($scope.Password1) ? $scope.Password1 : '';

            $scope.Password.HasValidLength = (v.length >= 8 && v.length <= 20);
            $scope.Password.HasAtLeastOneUppercase = uc.test(v);
            $scope.Password.HasAtLeastOneLowercase = lc.test(v);
            $scope.Password.HasAtLeastOneNumber = nc.test(v);
            $scope.Password.HasAtLeastOneSymbol = sc.test(v);

        };

    }
]);

