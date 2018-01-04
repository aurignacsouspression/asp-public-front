(function () {
    "use strict";

    angular
        .module("aurignac")
        .controller("PresentationController", PresentationController);

    function PresentationController() {
        var vm = this;
        vm.header = {
            title: "Pour tout savoir..."
        };
    }

})();
