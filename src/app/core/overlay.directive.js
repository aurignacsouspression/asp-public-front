// https://github.com/urish/angular-spinner/issues/38#issuecomment-93762205

(function () {
    "use strict";

    angular
        .module("aurignac.core")
        .directive("overlayLoader", overlayLoader);

    function overlayLoader() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                key: '@'
            },
            link: function (scope, element, attributes) {

                scope.$on('us-spinner:spin', function (event, key) {
                    if (key === scope.key) {
                    element.addClass('loading');
                    }
                });

                scope.$on('us-spinner:stop', function (event, key) {
                    if (key === scope.key) {
                        element.removeClass('loading');
                    }
                });

            },
            template: '<div class="us-spinner-wrapper"><div us-spinner spinner-key="{{key}}"></div></div>'
        };
    }
})();