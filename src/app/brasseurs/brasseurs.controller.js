(function () {
    "use strict";

    angular
        .module("aurignac.brasseurs")
        .controller("BrasseursController", BrasseursController);

    BrasseursController.$inject = ["firebaseFactory", "CDN_IMAGES", "$q", "brewers", "usSpinnerService"];
    function BrasseursController(firebaseFactory, CDN_IMAGES, $q, brewers, usSpinnerService) {
        var vm = this;
        vm.imgRoot = CDN_IMAGES + "brasseurs/";

        vm.hasImages = hasImages;
        vm.getBrewerImages = getBrewerImages;

        // Objet contenant les infos du header de la page (titre et fil d'ariane si nécessaire)
        vm.header = {
            title: "Les Brasseurs 2018",
            breadcrumb: [
                { state: "home", title: "Accueil" },
                { state: 'programme', title: 'Programme' }
            ]
        };

        activate();

        /////////////////

        function activate() {
            getEditionDetails(2018)
                .then(function (edition) {
                    return edition.key();
                })
                .then(getEditionBrasseurs)
                .then(function (brasseurs) {
                    vm.list = brasseurs;
                    usSpinnerService.stop("loading");
                    vm.loaded = true;
                });
        }

        /**
         * Retourne les détails d'une édition
         * @param {number} year - Année de l'édition
         * @returns {Promise} Promise des détails de l'édition
         */
        function getEditionDetails(year) {
            var deferred = $q.defer();
            firebaseFactory
                .getReference("editions")
                .orderByPriority()
                .equalTo(year)
                .once("child_added", deferred.resolve);

            return deferred.promise;
        }

        /**
         * Retourne la liste des brasseurs d'une édition donnée
         * @param {string} editionKey - Clé de l'édition dans Firebase
         * @returns {Promise} Promise de la liste des brasseurs
         */
        function getEditionBrasseurs(editionKey) {
            return brewers.getListAsArray()
                .then(function (list) {
                    return list.filter(function (brewer) {
                        return isBrewerInEdition(brewer, editionKey);
                    });
                });
        }

        /**
         * Indique si un brasseur a participé à une édition
         * @param {Object} brewer - Objet avec infos du brasseur
         * @param {string} editionKey - Clé de l'édition dans Firebase
         * @returns {Boolean}
         */
        function isBrewerInEdition(brewer, editionKey) {
            return brewer.editions && angular.isDefined(brewer.editions[editionKey]);
        }

        /**
         * Vérifie si le brasseur en paramètres a des images activées
         * @param {Object} brewer
         * @returns {Boolean}
         */
        function hasImages(brewer) {
            if (!brewer.contentImages) return false;

            var imagesActive = false;
            for (var key in brewer.contentImages) {
                if (brewer.contentImages[key].active) {
                    imagesActive = true;
                    break;
                }
            }

            return imagesActive;
        }

        function getBrewerImages(brewer) {
            var array = [];
            for (var key in brewer.contentImages) {
                if (brewer.contentImages[key].active) {
                    array.push({
                        src: vm.imgRoot + brewer.$id + "/medium/" + brewer.contentImages[key].filename
                    });
                }
            }

            return array;
        }
    }

})();
