(function () {
    "use strict";

    angular
        .module("aurignac.layout")
        .directive("aspFooter", aspFooter);

    function aspFooter() {
        return {
            restrict: "E",
            templateUrl: "app/layout/footer.html",
            controller: FooterController,
            controllerAs: "footer",
            scope: {},
            // bindToController: {
            //     header: "=",
            //     onload: "&"
            // }
        };
    }

    FooterController.$inject = ["$modal"];
    function FooterController($modal) {
        var vm = this;
        vm.openNewsLetterForm = openNewsLetterForm;

        ///////////////////

        function openNewsLetterForm() {
            var newsletterModal = $modal({ templateUrl: "app/core/newsletter.modal.html", animation:"am-fade-and-slide-top", show: false });
            newsletterModal.$promise.then(newsletterModal.show);
        }
    }

})();
