
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
            modalOptions = {};

        $scope.Types = [
            {
                option: "a student",
                value : "st"
            },
            {
                option: "teaching staff",
                value : "ts"
            },
            {
                option: "support staff",
                value: "ss"
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

        $scope.Classes = [
            {
                name : '1A'
            },
            {
                name : '2A'
            },
            {
                name : '3A'
            },
            {
                name : '4A'
            },
            {
                name : '5A'
            },
            {
                name : '6A'
            }
        ];

        $scope.Step = 'signup';

        $scope.Class = {};

        $scope.Type = {};

        $scope.AgreeTnC = false;

        $scope.FirstName = '';
        $scope.LastName = '';
        $scope.Email1 = '';
        $scope.Email2 = '';
        $scope.Password1 = '';
        $scope.Password2 = '';
        $scope.Other = '';

        $scope.CanSubmit = function () {

            // Form must be valid

            if (SignUpForm.$invalid) {
                return false;
            }


            // Must have agreed to T&C's

            if (! $scope.AgreeTnC) {
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

            // If they're a student, must have said which class they are in

            if (isStudent($scope.Type.value) && _.isEmpty($scope.Class)) {
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

            var mustHaveLengths = [$scope.FirstName, $scope.LastName, $scope.Email1, $scope.Password1];
            if (! formService.hasNonZeroLength(mustHaveLengths)) {
                return false;
            }


            if ($scope.Email1 !== $scope.Email2) {
                return false;
            }

            if ($scope.Password1 !== $scope.Password2) {
                return false;
            }


            return true;
        };

        $scope.OnSubmit = function () {

            if (isOther($scope.Type.value)) {
                $scope.Type.misc = $scope.Other
            } else if (isStudent($scope.Type.value)) {
                $scope.Type.misc = $scope.Class.name;
            }

            var data = {
                firstname : $scope.FirstName,
                lastname : $scope.LastName,
                password1 : $scope.Password1,
                password2 : $scope.Password2,
                email1 : $scope.Email1,
                email2 : $scope.Email2,
                role : $scope.Type
            };

            SignUp.save({}, data, function (data, headers) {
                    modal = $('#success');
                    modal.modal()
                },
                function (err) {
                    if (err.status === 400) {
                        modal = $('#error-email');
                        modal.modal (modalOptions)
                    } else {
                        modal = $('#error');
                        modal.modal (modalOptions);
                    }
                });

        };

        $scope.OnTryAgain = function () {
            modal.modal('hide');
        }

        $scope.OnContinueAfterEmailError = function () {
            $scope.Email1 = $scope.Email2 = '';
            $('#email1').focus();
            $scope.OnTryAgain();
        }

        $scope.OnSuccess = function () {
            modal.modal('hide');
            $window.location.href = '/home';
        }

    }
]);

