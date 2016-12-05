(function () {
    "use strict";

    var app = angular.module("myApp");

    app.controller("MyController", function ($scope) {
        $scope.countPrimitive = 1;

        $scope.countObjectToBeEntirelyReplaced = {
            count: 1
        };

        $scope.countObjectToHavePropertyUpdated = {
            count: 1
        };

        $scope.onChange = function () {
            alert(
                "countPrimitive in controller is " + $scope.countPrimitive + ". " +
                "countObjectToBeEntirelyReplaced.count in controller is " + $scope.countObjectToBeEntirelyReplaced.count + ". " +
                "countObjectToHavePropertyUpdated.count in controller is " + $scope.countObjectToHavePropertyUpdated.count + "."
            )
        };
    });
})();