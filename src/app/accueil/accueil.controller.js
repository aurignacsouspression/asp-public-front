(function () {
    "use strict";

    angular
        .module("aurignac")
        .controller("AccueilController", AccueilController);

    AccueilController.$inject = ["firebaseFactory"];
    function AccueilController(firebaseFactory) {
        var vm = this;
        vm.visualTitle = visualTitle;

        vm.logos = ["logo-1.png", "logo-2.png", "logo-3.png", "logo-4.png", "logo-5.png", "logo-6.png"];
        // vm.articles = firebaseFactory.getAsArray("articles");
        vm.editions = firebaseFactory.getAsArray("editions");

        activate();

        /////////////////////

        function activate() {
            firebaseFactory.getAsArray("articles").$loaded()
                .then(function (result) { vm.articles = result.slice(-4).reverse(); })
                .catch(function (error) { console.log(error); });
        }

        function visualTitle(item) {
            return item.el.attr('title') + ' &middot; <a href="'+item.el.attr('data-source')+'" target="_blank" download>Télécharger</a>';
        }
    }

})();
