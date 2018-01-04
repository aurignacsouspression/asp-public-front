(function () {
    "use strict";

    angular
        .module("aurignac.brasseurs")
        .factory("brewers", brewers);

    brewers.$inject = ["firebaseFactory", "$q"];
    function brewers(firebaseFactory, $q) {
        var _brewersAsObject, _brewersAsArray;

        var service = {
            getListAsObject: getListAsObject,
            getListAsArray: getListAsArray
        };

        return service;

        ////////////////////

        /**
         * Récupère la liste des brasseurs dans Firebase et la retourne sous forme d'objet
         * @returns {Promise} Promise de la liste des brasseurs
         */
        function getListAsObject() {
            if (_brewersAsObject) return $q.when(_brewersAsObject);
            return firebaseFactory.getAsObject("brasseurs")
                .$loaded()
                .then(function (brewers) {
                    _brewersAsObject = brewers;
                    return _brewersAsObject;
                });
        }

        /**
         * Récupère la liste des brasseurs dans Firebase et la retourne sous forme de tableau
         * @returns {Promise} Promise de la liste des brasseurs
         */
        function getListAsArray() {
            if (_brewersAsArray) return $q.when(_brewersAsArray);
            return firebaseFactory.getAsArray("brasseurs")
                .$loaded()
                .then(function (brewers) {
                    _brewersAsArray = brewers;
                    return _brewersAsArray;
                });
        }

        /**
         * Retourne les infos sur un brasseur particulier
         * @param {string} id - Id du brasseur
         * @returns {Object}
         */
        function getDetails(id) {

        }
    }

})();
