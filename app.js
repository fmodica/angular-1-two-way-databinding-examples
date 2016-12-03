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
                    // Simulate conditions for an "$apply already in progress" error.
                    scope.$apply(function () {
                        scope.$evalAsync(function () {
                            ngModelCtrl.$setViewValue(jQueryPluginApi.getCount());
                        });
                    });
                });
            }
        };
    });

    app.directive("customDirectiveWithEqualsAvoidingDigestError", function ($timeout) {
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
                    alert("Rendering new value in customDirectiveWithEqualAvoidingDigestError directive: " + scope.model);
                    jQueryPluginApi.setCount(scope.model);
                });

                $element.on("countUpdate", function () {
                    // Simulate conditions for an "$apply already in progress" error.
                    scope.$apply(function () {
                        scope.model = jQueryPluginApi.getCount();

                        // We cannot call $scope.$apply or we will get an "$apply already in progress" error.

                        // Error!
                        // scope.$apply(function () {
                        //     scope.onChange();
                        // });

                        // $scope.evalAsync won't work either because it will evaluate inside the
                        // the current digest cycle, after which the controller's value would be 
                        // updated.

                        // scope.$evalAsync(function () {
                        //     // Model won't be updatd yet!
                        //     scope.onChange();
                        // });

                        // We have to force another digest cycle in a way that does not trigger an error.
                        // $timeout works but may cause flicker since this will be executed after the DOM renders.
                        $timeout(function () {
                            scope.onChange()
                        });
                    });
                });
            }
        };
    });
})();