(function () {
    'use strict';

    angular
        .module('aurignac')
        .directive('aspSlider', aspSlider)
        .directive('aspAnimation', aspAnimation)
        .directive('aspWordRotate', aspWordRotate)
        .directive('aspSticky', aspSticky)
        .directive('aspHashScroll', aspHashScroll)
        .directive('aspFcSlideshow', aspFcSlideshow);

    function aspSlider() {
        return {
            restrict: "A",
            scope: {
                pluginOptions: "&"
            },
            link: function (scope, element, attrs) {
                element.themePluginRevolutionSlider(scope.pluginOptions());
            }
        };
    }

    function aspAnimation() {
        return {
            restrict: "A",
            scope: {
                pluginOptions: "&"
            },
            link: function (scope, element, attrs) {
                element.themePluginAnimate(scope.pluginOptions());
            }
        };
    }

    function aspWordRotate() {
        return {
            restrict: "A",
            scope: {
                pluginOptions: "&"
            },
            link: function (scope, element, attrs) {
                element.themePluginWordRotate(scope.pluginOptions());
            }
        };
    }

    function aspSticky() {
        return {
            restrict: "A",
            scope: {
                pluginOptions: "&"
            },
            link: function (scope, element) {
                scope.$on("sticky:load", function () {
                    element.themePluginSticky(scope.pluginOptions());
                });
            }
        };
    }

    function aspHashScroll() {
        return {
            restrict: "A",
            scope: {
                pluginOptions: "&"
            },
            link: function (scope, element, attrs) {
                var defaults = {
                    wrapper: $('#mainNav'),
                    scrollDelay: 600,
                    scrollAnimation: 'easeOutQuad'
                };

                var options = angular.extend({}, defaults, scope.pluginOptions);

                element.on('click', function (e) {
                    e.preventDefault();

                    var offset = attrs.hashOffset || 0;
                    angular.element('body').addClass('scrolling');

                    angular.element('html, body').animate({
                        scrollTop: angular.element(attrs.href).offset().top - offset
                    }, options.scrollDelay, options.scrollAnimation, function () {
                        angular.element('body').removeClass('scrolling');
                    });

                    return;
                });
            }
        };
    }

    function aspFcSlideshow() {
        return {
            restrict: "A",
            scope: {
                pluginOptions: "&"
            },
            link: function (scope, element) {
                element.flipshow();

                setTimeout(function circleFlip() {
                    element.data().flipshow && element.data().flipshow._navigate(element.find('div.fc-right span:first'), 'right');
                    setTimeout(circleFlip, 3000);
                }, 3000);
            }
        };
    }

})();
