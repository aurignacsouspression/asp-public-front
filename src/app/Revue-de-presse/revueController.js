(function () {
    "use strict";

    angular
        .module("aurignac")
        .controller("ArticlesController", ArticlesController);

    ArticlesController.$inject = ['firebaseFactory'];
    function ArticlesController(firebaseFactory) {
        var vm = this;
        
        vm.articles = firebaseFactory.getAsArray("articles"); 
    }

})();
