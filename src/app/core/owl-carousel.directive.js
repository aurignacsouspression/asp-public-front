// https://github.com/jonahbron/angular-owl-carousel
// http://stackoverflow.com/questions/27988502/applying-angularjs-ng-repeat-to-owl-carousel

(function () {
    "use strict";

    angular
        .module("aurignac.core")
        .directive("owlCarousel", owlCarousel)
        .directive("owlCarouselItem", owlCarouselItem);

    owlCarousel.$inject = ["$parse"];
    function owlCarousel($parse) {
        var owlOptions = [
            "items",
            "margin",
            "loop",
            "center",
            "mouseDrag",
            "touchDrag",
            "pullDrag",
            "freeDrag",
            "merge",
            "mergeFit",
            "autoWidth",
            "startPosition",
            "URLhashListener",
            "nav",
            "navRewind",
            "navText",
            "slideBy",
            "dots",
            "dotsEach",
            "dotData",
            "lazyLoad",
            "lazyContent",
            "autoplay",
            "autoplayTimeout",
            "autoplayHoverPause",
            "smartSpeed",
            "fluidSpeed",
            "autoplaySpeed",
            "dotsSpeed",
            "dragEndSpeed",
            "callbacks",
            "responsive",
            "responsiveRefreshRate",
            "responsiveBaseElement",
            "responsiveClass",
            "video",
            "videoHeight",
            "videoWidth",
            "animateOut",
            "animateIn",
            "fallbackEasing",
            "info",
            "nestedItemSelector",
            "itemElement",
            "stageElement",
            "stagePadding",
            "navContainer",
            "dotsContainer",

            // Classes
            "themeClass",
            "baseClass",
            "itemClass",
            "centerClass",
            "activeClass",
            "navContainerClass",
            "navClass",
            "controlsClass",
            "dotClass",
            "dotsClass",
            "autoHeightClass",

            // Callbacks
            "onInitialize",
            "onInitialized",
            "onResize",
            "onResized",
            "onRefresh",
            "onRefreshed",
            "onDrag",
            "onDragged",
            "onTranslate",
            "onTranslated",
            "onChange",
            "onChanged",
            "onStopVideo",
            "onPlayVideo",
            "onLoadLazy",
            "onLoadedLazy"
        ];

        return {
            restrict: "A",
            controller: ["$attrs", "$element", function ($attrs, $element) {
                var vm = this;
                vm.initCarousel = initCarousel;

                /* Template defaults */
                var defaults = {
                    loop: false,
                    responsive: {
                        0: {
                            items: 1
                        },
                        479: {
                            items: 1
                        },
                        768: {
                            items: 2
                        },
                        979: {
                            items: 3
                        },
                        1199: {
                            items: 4
                        }
                    },
                    navText: []
                };

                //////////////////

                function initCarousel() {
                    var options = {};
                        // owlCarousel = null,
                        // propertyName = $attrs.owlCarousel;

                    for (var i = 0; i < owlOptions.length; i++) {
                        var opt = owlOptions[i];
                        if ($attrs[opt] !== undefined) {
                            options[opt] = $parse($attrs[opt])();
                        }
                    }

                    /* Comportement récupéré du template */
                    options = angular.merge({}, defaults, options);
                    if (options.items == 1) {
                        options.responsive = {};
                    }

                    if (options.items > 4) {
                        options = angular.merge({}, options, {
                            responsive: {
                                1199: {
                                    items: options.items
                                }
                            }
                        });
                    }

                    // init carousel
                    $element.owlCarousel(options);
                };
            }]
        };
    }

    function owlCarouselItem() {
        return {
            restrict: "A",
            require: "^owlCarousel",
            link: function (scope, element, attrs, carouselController) {
                // wait for the last item in the ng-repeat then call init
                if (scope.$last) {
                    carouselController.initCarousel();
                }
            }
        };
    }

})();
