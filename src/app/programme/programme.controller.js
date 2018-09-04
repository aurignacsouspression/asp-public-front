(function () {
    "use strict";

    angular
        .module("aurignac")
        .controller("ProgrammeController", ProgrammeController);

    ProgrammeController.$inject = ["$scope"];
    function ProgrammeController($scope) {
        var vm = this;

        // Objet contenant les infos du header de la page (titre et fil d'ariane si nécessaire)
        vm.header = {
            title: "Programme complet",
            // breadcrumb: [{link: "/", class: "active", title: "Accueil"}]
        };

        // vm.weekend = [
        //     "<strong>Salon des brasseries artisanales et des brasseurs amateurs</strong> avec plus d'une dizaine de brasseurs venus de toute la région et même au-delà ! Rencontre, dégustations, exposition de matériel de brassage.",
        //     "<strong>Brassage public participatif chaque jour</strong> et forums : comment brasser sa bière ?.",
        //     "En accord avec le thème 2015, dégustation-vente de rhum cubain !",
        //     "<strong>Grand rassemblement de Harley-Davidson, Indian, Victory, voitures américaines, Hot Rod</strong>... avec parking dédié sur place.",
        //     "Présence de Customs-Planet et show-bike exceptionnel de motos customs.",
        //     "Une dizaine d'exposants, artisans, marchands et tatoueurs de l'univers de la moto.",
        //     "Initiation et concours de fléchettes avec le \"WoodPecker Dart's Club\" de Saint-Martory."
        // ];

        vm.samedi = [
            "Pour la première fois : <strong>DJ contest</strong>",
            "<strong>Apéritif musical</strong> « France des fifties » et première partie avec « Mystère Daoud »",
            "<strong>Repas vintage avec menus plat-dessert-café au choix</strong> (sur réservation, places limitées).",
            "<strong>Concert rockabilly</strong> avec le groupe <strong>« Rocking Billies » en deuxième partie de soirée</strong>."
        ];

        vm.dimanche = [
            '<a href="brassage">Brassage public participatif</a> (inscription obligatoire, places limitées)',
            '<a href="bike-contest">Bike Contest</a>, ouvert à tous les possesseurs de motos customs',
            '<strong>Jeux bikers</strong> (course de lenteur, concours de bras de fer…) avec nombreux lots à gagner !',
            "<strong>Zone d'expo-vente de motos customs et voitures américaines</strong> réservée aux particuliers",
            "Exposition de voitures (rassemblement au foirail d'Aurignac à 10h00) et motos collectors",
            'Rassemblement de <strong>nombreuses 2CV</strong> pour les 70 ans de notre voiture mythique, avec animations-challenges : faire rentrer 22 personnes dans une seule 2CV et démonter/remonter une 2CV en « live » !',
            "Comme le samedi, <strong>repas vintage avec 2 menus plat-dessert au choix</strong> le midi (sur réservation, places limitées là aussi !).",
            "Animations musicales <strong>fifties</strong>",
            "Circuits balades libres pour les motards et animations sécurité routière",
            "Résultats du <strong>concours de bière</strong> officiel d'Aurignac Sous Pression 2018 et remise du <strong>brassin d'or</strong> à la bière préférée du public"
        ];

        vm.onload = onLoad;

        ////////////////////

        /**
         * Fonction appelée lorsque le header est chargé, elle indique que le plugin sticky peut se charger à son tour
         */
        function onLoad() {
            setTimeout(function () {
                $scope.$broadcast("sticky:load");
            }, 0);
        }
    }

})();
