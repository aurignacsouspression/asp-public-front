(function () {
    "use strict";

    angular
        .module("aurignac.partenaires")
        .factory("partners", partners);

    partners.$inject = ["firebaseFactory", "$q"];
    function partners(firebaseFactory, $q) {
        var _partners, _mainPartners, _secondaryPartners;
        var service = {
            mainAsArray: getMainPartnersAsArray,
            secondaryAsArray: getSecondaryPartnersAsArray
        };

        return service;

        /////////////////////

        /**
         * Récupère la liste de tous les partenaires actifs sous forme de tableau
         */
        function getAll() {
            if (_partners) return $q.when(_partners);
            return firebaseFactory.getAsArray("partenaires")
                .$loaded()
                .then(getActivePartners);
        }

        /**
         * Filtre une liste de partenaires et retourne les actifs
         * @param {Object[]} partners
         * @returns {Object[]}
         */
        function getActivePartners(partners) {
            return _partners = partners.filter(function (partner) {
                return partner.active;
            });
        }

        /**
         * Retourne la liste des partenaires principaux (plein page) sous forme de tableau
         * @returns {Object[]} partners
         */
        function getMainPartnersAsArray() {
            if (_mainPartners) return $q.when(_mainPartners);

            _mainPartners = [];
            var deferred = $q.defer();
            firebaseFactory
                .getReference("partenaires")
                .orderByChild("size")
                .equalTo(0)
                .once("value", function (snapshot) {
                    snapshot.forEach(function (partner) {
                        _mainPartners.push(partner.val());
                    });

                    _mainPartners = _mainPartners
                        .filter(function (partner) {
                            return partner.active;
                        })
                        .sort(function (a, b) {
                            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                            var nameB = b.name.toUpperCase(); // ignore upper and lowercase

                            if (nameA < nameB) {
                                return -1;
                            }

                            if (nameA > nameB) {
                                return 1;
                            }

                            // names must be equal
                            return 0;
                        });

                    deferred.resolve(_mainPartners);
                });

            return deferred.promise;
        }

        /**
         * Retourne la liste des partenaires secondaires sous forme de tableau
         * @returns {Object[]} partners
         */
        function getSecondaryPartnersAsArray() {
            if (_secondaryPartners) return $q.when(_secondaryPartners);

            return getAll().then(function (partners) {
                return _secondaryPartners = partners.filter(function (partner) {
                    return partner.size > 0;
                });
            });
        }
    }

})();
