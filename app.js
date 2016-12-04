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

    app.directive("ngModelBindingToPrimitive", function () {
        return {
            require: "ngModel",
            scope: {},
            link: function (scope, $element, attrs, ngModelCtrl) {
                var jQueryPluginApi = $element.thirdPartyJQueryPlugin().data("api");

                // This executes when the model changes (but not when this directive 
                // updates the model with $setViewValue below).
                ngModelCtrl.$render = function () {
                    // Update the DOM (in this case we update thirdPartyJQueryPlugin).
                    console.log("Rendering new value in ngModelBindingToPrimitive directive: " + ngModelCtrl.$viewValue);
                    jQueryPluginApi.setCount(ngModelCtrl.$viewValue);
                };

                $element.on("countUpdate", function () {
                    // Update the model. Any "ng-change" callback will execute after the
                    // model is updated.
                    ngModelCtrl.$setViewValue(jQueryPluginApi.getCount());
                    scope.$apply();
                });
            }
        };
    });

    app.directive("ngModelBindingToPrimitiveAvoidingDigestError", function () {
        return {
            require: "ngModel",
            scope: {},
            link: function (scope, $element, attrs, ngModelCtrl) {
                var jQueryPluginApi = $element.thirdPartyJQueryPlugin().data("api");

                ngModelCtrl.$render = function () {
                    console.log("Rendering new value in ngModelBindingToPrimitiveAvoidingDigestError directive: " + ngModelCtrl.$viewValue);
                    jQueryPluginApi.setCount(ngModelCtrl.$viewValue);
                };

                $element.on("countUpdate", function () {
                    // Simulate a digest already in progress.
                    scope.$apply(function () {
                        // Use "$evalAsync" instead of "$apply" because the latter won't throw
                        // an "$apply already in progress" error if we are in the middle of a 
                        // digest cycle, but it will schedule an additional digest cycle if
                        // needed.
                        scope.$evalAsync(function () {
                            ngModelCtrl.$setViewValue(jQueryPluginApi.getCount());
                        });
                    });
                });
            }
        };
    });

    app.directive("equalsBindingToPrimitive", function () {
        return {
            scope: {
                model: "=",
                onChange: "&"
            },
            link: function (scope, $element, attrs, ngModelCtrl) {
                var jQueryPluginApi = $element.thirdPartyJQueryPlugin().data("api");

                // Watch the model for changes. This will run both when the controller
                // updates the model AND when this directive updates the model
                // (potentially causing an unnecessary re-render of the DOM in the 
                // latter case).
                scope.$watch(function () {
                    return scope.model;
                }, function () {
                    // Update the DOM (in this case we update thirdPartyJQueryPlugin).
                    console.log("Rendering new value in equalsBindingToPrimitive directive: " + scope.model);
                    jQueryPluginApi.setCount(scope.model);
                });

                $element.on("countUpdate", function () {
                    // Update the model. Execute the onChange callback manually after
                    // the model is updated. Note that our "$watch" function above will
                    // run, potentially causing an unnecessary re-render of the DOM.
                    scope.model = jQueryPluginApi.getCount();
                    scope.$apply();
                    scope.onChange();
                });
            }
        };
    });

    app.directive("equalsBindingToPrimitiveAvoidingDigestError", function ($timeout) {
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
                    console.log("Rendering new value in equalsBindingToPrimitiveAvoidingDigestError directive: " + scope.model);
                    jQueryPluginApi.setCount(scope.model);
                });

                $element.on("countUpdate", function () {
                    // Simulate a digest already in progress.
                    scope.$apply(function () {
                        scope.model = jQueryPluginApi.getCount();

                        // We cannot call "$apply" to force a digest cycle because we will get
                        // an "$apply already in progress" error.

                        // scope.$apply()
                        // scope.onChange();

                        // "evalAsync" won't work because it will evaluate "onChange" inside 
                        // the current digest cycle, so the controller's value won't be 
                        // updated yet,

                        // scope.$evalAsync(function () {
                        //     // Model won't be updated yet!
                        //     scope.onChange();
                        // });

                        // "$timeout" will run our "onChange" callback after the current 
                        // digest cycle is over, ensuring that our model is updated. But it 
                        // executes after the DOM has rendered, so there is risk that the UI 
                        // may flicker.
                        $timeout(function () {
                            scope.onChange()
                        });
                    });
                });
            }
        };
    });

    app.directive("equalsBindingToObject", function () {
        return {
            scope: {
                model: "=",
                onChange: "&"
            },
            link: function (scope, $element, attrs, ngModelCtrl) {
                var jQueryPluginApi = $element.thirdPartyJQueryPlugin().data("api");

                scope.$watch(function () {
                    return scope.model.count;
                }, function () {
                    console.log("Rendering new value in equalsBindingToObject directive: " + scope.model.count);
                    jQueryPluginApi.setCount(scope.model.count);
                });

                $element.on("countUpdate", function () {
                    // Update the model. In this case the model is a copy of the reference
                    // to the object in the controller. Thus we are updating properties on
                    // the controller object directly.
                    scope.$evalAsync(function () {
                        scope.model.count = jQueryPluginApi.getCount();
                        scope.onChange();
                    });
                });
            }
        };
    });
})();