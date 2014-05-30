
function isStudent (v) {
    return v === 'st';
}

function isOther (v) {
    return v === 'na';
}

// userControllers is declared in scripts/user-app.js

userControllers.controller('SignUpController', ['$scope', '$timeout',
    function ($scope, $timeout) {

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

            // So finally, a complete name, matching email addresses and passwords must be supplied


            var mustHaveLengths = [$scope.FirstName, $scope.LastName, $scope.Email1, $scope.Password1];

            for (var i = 0; i < mustHaveLengths.length; i++) {
                if (mustHaveLengths[i].length === 0) {
                    return false;
                }
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

        };

    }
]);

