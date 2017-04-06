(function () {
    "use strict";

    var app = angular.module("myApp");

    // This directive uses ng-model to accomplish two-way databinding to a 
    // primitive (number). If you get a "$digest already in progress" 
    // error, look at the "ngModelBindingToPrimitiveAvoidingDigestError"
    // directive below.

    app.directive("ngModelBindingToPrimitive", function () {
        return {
            require: "ngModel",
            scope: {
                param1: "@",
                param2: "@"
            },
            link: function (scope, $element, attrs, ngModelCtrl) {
                var jQueryPluginApi = $element.thirdPartyJQueryPlugin().data("api");

                // This executes when the model changes (but not when this directive 
                // updates the model with $setViewValue below).

                ngModelCtrl.$render = function () {

                    // Update the DOM (in this case we update thirdPartyJQueryPlugin).

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

    // This directive uses ng-model to accomplish two-way databinding to a 
    // primitive (number). It avoids errors that occur when a digest is 
    // already in progress.

    app.directive("ngModelBindingToPrimitiveAvoidingDigestError", function () {
        return {
            require: "ngModel",
            scope: {
                param1: "@",
                param2: "@"
            },
            link: function (scope, $element, attrs, ngModelCtrl) {
                var jQueryPluginApi = $element.thirdPartyJQueryPlugin().data("api");

                // This executes when the model changes (but not when this directive 
                // updates the model with $setViewValue below).

                ngModelCtrl.$render = function () {

                    // Update the DOM (in this case we update thirdPartyJQueryPlugin).

                    jQueryPluginApi.setCount(ngModelCtrl.$viewValue);
                };

                $element.on("countUpdate", function () {

                    // ******************** Simulate a digest already in progress using "$apply" (REMOVE THIS IN REAL CODE!) ********************

                    scope.$apply(function () {

                        // Update the model. Any "ng-change" callback will execute after the
                        // model is updated. Use "$evalAsync" instead of "$apply" because the 
                        // former won't throw an "$apply already in progress" error if we are 
                        // in the middle of a digest cycle, but it will schedule an additional 
                        // digest cycle if needed.

                        scope.$evalAsync(function () {
                            ngModelCtrl.$setViewValue(jQueryPluginApi.getCount());
                        });
                    });
                });
            }
        };
    });

    // This directive uses ng-model to accomplish two-way databinding to 
    // an object. It avoids errors that occur when a digest is already
    // in progress.

    app.directive("ngModelBindingToObjectAvoidingDigestError", function () {
        return {
            require: "ngModel",
            scope: {
                param1: "@",
                param2: "@"
            },
            link: function (scope, $element, attrs, ngModelCtrl) {
                var jQueryPluginApi = $element.thirdPartyJQueryPlugin().data("api");

                // This executes when the model changes (but not when this directive 
                // updates the model with $setViewValue below).

                ngModelCtrl.$render = function () {

                    // Update the DOM (in this case we update thirdPartyJQueryPlugin).

                    jQueryPluginApi.setCount(ngModelCtrl.$viewValue.count);
                };

                $element.on("countUpdate", function () {

                    // ******************** Simulate a digest already in progress using "$apply" (REMOVE THIS IN REAL CODE!) ********************

                    scope.$apply(function () {

                        // Use "$evalAsync" instead of "$apply" because the latter won't throw
                        // an "$apply already in progress" error if we are in the middle of a 
                        // digest cycle, but it will schedule an additional digest cycle if
                        // needed.

                        scope.$evalAsync(function () {
                            ngModelCtrl.$setViewValue({
                                count: jQueryPluginApi.getCount()
                            });
                        });
                    });
                });
            }
        };
    });

    // This directive uses scope "=" to accomplish two-way databinding to 
    // a primitive (number). If you get a "$digest already in progress" 
    // error, look at the "equalsBindingToPrimitiveAvoidingDigestError"
    // directive below.

    app.directive("equalsBindingToPrimitive", function () {
        return {
            scope: {
                model: "=",
                onChange: "&",
                param1: "@",
                param2: "@"
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

    // This directive uses scope "=" to accomplish two-way databinding to 
    // a primitive (number). It avoids errors that occur when a digest is 
    // already in progress.

    app.directive("equalsBindingToPrimitiveAvoidingDigestError", function ($timeout) {
        return {
            scope: {
                model: "=",
                onChange: "&",
                param1: "@",
                param2: "@"
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

                    jQueryPluginApi.setCount(scope.model);
                });

                $element.on("countUpdate", function () {

                    // ******************** Simulate a digest already in progress using "$apply" (REMOVE THIS IN REAL CODE!) ********************

                    scope.$apply(function () {

                        // Update the model. Execute the onChange callback manually after
                        // the model is updated. Note that our "$watch" function above will
                        // run, potentially causing an unnecessary re-render of the DOM.

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
                        // may flicker. If you do not like this, look at the 
                        // "equalsBindingToObjectUpdatingProperty" directive below.

                        $timeout(function () {
                            scope.onChange()
                        });
                    });
                });
            }
        };
    });

    // This directive uses scope "=" to accomplish two-way databinding to 
    // an object. It updates a property on that object.

    app.directive("equalsBindingToObjectUpdatingProperty", function () {
        return {
            scope: {
                model: "=",
                onChange: "&",
                param1: "@",
                param2: "@"
            },
            link: function (scope, $element, attrs, ngModelCtrl) {
                var jQueryPluginApi = $element.thirdPartyJQueryPlugin().data("api");

                // Watch the model for changes. This will run both when the controller
                // updates the model AND when this directive updates the model
                // (potentially causing an unnecessary re-render of the DOM in the 
                // latter case).

                scope.$watch(function () {
                    return scope.model.count;
                }, function () {

                    // Update the DOM (in this case we update thirdPartyJQueryPlugin).

                    jQueryPluginApi.setCount(scope.model.count);
                });

                $element.on("countUpdate", function () {

                    // Update the model. Execute the onChange callback manually after
                    // the model is updated. Note that our "$watch" function above will
                    // run, potentially causing an unnecessary re-render of the DOM. In 
                    // this case the model is a copy of the reference to the object in
                    // the controller. Thus we are updating properties on the controller 
                    // object directly.

                    scope.$evalAsync(function () {
                        scope.model.count = jQueryPluginApi.getCount();
                        scope.onChange();
                    });
                });
            }
        };
    });
})();
