(function () {
    "use strict";

    angular
        .module("aurignac.core")
        .directive("aspMagnificPopup", aspMagnificPopup);

    aspMagnificPopup.$inject = ["$q"];
    function aspMagnificPopup($q) {
        var popupOptions = [
            "type",
            "delegate",
            "gallery",
            "zoom"
        ];

        var imageOptions = [
            "titleSrc"
        ];

        var defaults = {
            type: "image",
            delegate: "a"
        };

        return {
            restrict: "A",
            scope: {
                titleSrc: "&",
                items: "&"
            },
            link: function (scope, element, attrs) {
                var options = {};
                popupOptions.forEach(function (value) {
                    if (attrs[value] !== undefined) {
                        if (value == "gallery") {
                            options.gallery = { enabled: true };
                        } else if (value == "zoom") {
                            options.mainClass = "mfp-with-zoom";
                            options[value] = {
                                enabled: true, // By default it's false, so don't forget to enable it
                                duration: 300, // duration of the effect, in milliseconds
                                easing: "ease-in-out", // CSS transition easing function
                            };
                        } else {
                            options[value] = attrs[value];
                        }
                    }
                });

                options = angular.merge({}, defaults, options);
                if (options.type == "image") {
                    if (scope.titleSrc) {
                        options.image = {
                            titleSrc: callTitleSrc
                        };
                    }
                    // imageOptions.forEach(function (value) {
                    //     if (attrs[value] !== undefined) {
                    //         options.image = options.images || {};
                    //         options.image[value] = $parse(attrs[value]);
                    //     }
                    // });
                }

                if (options.gallery) {
                    $q.when(scope.items()).then(function (items) {
                        if (items) {
                            options.items = items;
                            delete options.delegate;
                        }

                        element.magnificPopup(options);
                    });
                } else {
                    element.magnificPopup(options);
                }

                ////////////////

                function callTitleSrc(item) {
                    return scope.titleSrc({ item: item });
                }
            }
        };
    }

})();
