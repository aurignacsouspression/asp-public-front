(function () {
    "use strict";

    angular
        .module("aurignac.partenaires")
        .controller("PartenairesController", PartenairesController);

    PartenairesController.$inject = ["partners", "usSpinnerService", "$q", "CDN_IMAGES"];
    function PartenairesController(partners, usSpinnerService, $q, CDN_IMAGES) {
        var vm = this;
        vm.adRootPath = CDN_IMAGES + "partenaires/";

        // Objet contenant les infos du header de la page (titre et fil d'ariane si nécessaire)
        vm.header = {
            title: "Partenaires",
            // breadcrumb: [{link: "/", class: "active", title: "Accueil"}]
        };

        activate();

        /////////////////

        function activate() {
            getActivePartners();
        }

        /**
         * Récupère la liste des partenaires
         */
        function getActivePartners() {
            $q.all([partners.mainAsArray(), partners.secondaryAsArray()])
                .then(function (results) {
                    vm.mainList = results[0];
                    vm.secondList = results[1];
                    usSpinnerService.stop("loading");
                    vm.loaded = true;
                });
        }
    }

})();
