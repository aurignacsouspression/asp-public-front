(function () {
    "use strict";

    angular
        .module("aurignac.layout")
        .directive("aspHeader", aspHeader);

    function aspHeader() {
        return {
            restrict: "E",
            transclude: true,
            templateUrl: "app/layout/header.html",
            controller: HeaderController,
            controllerAs: "header",
            scope: {},
            bindToController: {
                header: "=",
                onload: "&"
            }
        };
    }

    function HeaderController() {
        var vm = this;

        vm.title = vm.header.title;
        vm.breadcrumb = vm.header.breadcrumb || undefined;

        vm.onload();
    }

})();
