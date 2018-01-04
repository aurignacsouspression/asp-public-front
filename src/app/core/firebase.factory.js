(function () {
    "use strict";

    angular
        .module("aurignac.core")
        .factory("firebaseFactory", firebaseFactory);

    firebaseFactory.$inject = ["FIREBASE_URL", "$firebaseObject", "$firebaseArray"];
    function firebaseFactory(FIREBASE_URL, $firebaseObject, $firebaseArray) {
        var service = {
            getAsArray: getAsArray,
            getAsObject: getAsObject,
            getCategoryObject: getCategoryObject,
            getReference: getReference
        };

        return service;

        ////////////////////////////

        function getAsArray(path) {
            var ref = new Firebase(FIREBASE_URL).child(path);
            return $firebaseArray(ref);
        }

        function getAsObject(path) {
            var ref = new Firebase(FIREBASE_URL).child(path);
            return $firebaseObject(ref);
        }

        function getCategoryObject(category, child) {
            var ref = new Firebase(FIREBASE_URL).child(category).child(child);
            return $firebaseObject(ref);
        }

        function getReference(path) {
            return new Firebase(FIREBASE_URL).child(path);
        }
    }

})();
