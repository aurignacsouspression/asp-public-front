(function () {
    "use strict";

    angular
        .module("aurignac")
        .controller("HebergementController", HebergementController);

    HebergementController.$inject = ['firebaseFactory','$stateParams'];
    function HebergementController(firebaseFactory,$stateParams) {
        var vm = this;

        vm.hebergements = firebaseFactory.getAsArray("hebergements");
        vm.hebergement = firebaseFactory.getAsObject("hebergements/"+$stateParams.id);
    }

})();
