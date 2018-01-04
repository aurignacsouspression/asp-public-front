(function () {
    "use strict";

    angular
        .module("aurignac.brasseurs")
        .controller("BrasseurController", BrasseurController);

    BrasseurController.$inject = ["brewer", "CDN_IMAGES", "$stateParams"];
    function BrasseurController(brewer, CDN_IMAGES, $stateParams) {
        var vm = this;
        vm.details = brewer;
        vm.imgRoot = CDN_IMAGES + "brasseurs/" + $stateParams.id + "/";

        // Objet contenant les infos du header de la page (titre et fil d'ariane si nécessaire)
        vm.header = {
            title: brewer.name,
            breadcrumb: [
                { state: "home", title: "Accueil" },
                { state: 'programme', title: 'Programme' },
                { state: "brasseurs", title: "Brasseurs" }
            ]
        };

        vm.responsiveImages = {
            0: {
                items: 2
            },
            768: {
                items: 3
            }
        };
    }

})();
