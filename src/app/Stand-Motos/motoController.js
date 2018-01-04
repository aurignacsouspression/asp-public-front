(function () {
    "use strict";

    angular
        .module("aurignac")
        .controller("MotosController", MotosController);

    MotosController.$inject = ['firebaseFactory'];
    function MotosController(firebaseFactory) {
        var vm = this;
        
        vm.motos = firebaseFactory.getAsArray("moto"); 
    }

})();
