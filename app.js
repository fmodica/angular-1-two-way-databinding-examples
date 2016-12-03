(function () {
    "use strict";

    var app = angular.module("myApp", []);

    app.controller("MyController", function ($scope) {
        $scope.obj = {
            count: 1
        };

        $scope.onChange = function () {
            alert("Value in controller is " + $scope.obj.count);
        };
    });

    app.directive("customDirectiveWithNgModel", function () {
        return {
            require: "ngModel",
            link: function (scope, $element, attrs, ngModelCtrl) {
                var jQueryPluginApi = $element.thirdPartyJQueryPlugin().data("api");

                ngModelCtrl.$render = function () {
                    alert("Rendering new value in customDirectiveWithNgModel directive: " + ngModelCtrl.$viewValue);
                    jQueryPluginApi.setCount(ngModelCtrl.$viewValue);
                };

                $element.on("countUpdate", function () {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(jQueryPluginApi.getCount());
                    });
                });
            }
        };
    });

    app.directive("customDirectiveWithEquals", function () {
        return {
            scope: {
                model: "=",
                onChange: "&"
            },
            link: function (scope, $element, attrs, ngModelCtrl) {
                var jQueryPluginApi = $element.thirdPartyJQueryPlugin().data("api");

                scope.$watch(function () {
                    return scope.model;
                }, function () {
                    alert("Rendering new value in customDirectiveWithEquals directive: " + scope.model);
                    jQueryPluginApi.setCount(scope.model);
                });

                $element.on("countUpdate", function () {
                    scope.model = jQueryPluginApi.getCount();
                    scope.$apply(function () {
                        scope.onChange();
                    });
                });
            }
        };
    });

    app.directive("customDirectiveWithNgModelAvoidingDigestError", function () {
        return {
            require: "ngModel",
            link: function (scope, $element, attrs, ngModelCtrl) {
                var jQueryPluginApi = $element.thirdPartyJQueryPlugin().data("api");

                ngModelCtrl.$render = function () {
                    alert("Rendering new value in customDirectiveWithNgModelAvoidingDigestError directive: " + ngModelCtrl.$viewValue);
                    jQueryPluginApi.setCount(ngModelCtrl.$viewValue);
                };

                $element.on("countUpdate", function () {
                    // Simulate conditions for an "$apply already in progress" error
                    scope.$apply(function () {
                        scope.$evalAsync(function () {
                            ngModelCtrl.$setViewValue(jQueryPluginApi.getCount());
                        });
                    });
                });
            }
        };
    });
})();