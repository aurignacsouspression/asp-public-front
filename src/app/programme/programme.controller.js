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
            'Pour la première fois : <b>restauration sans réservation à partir de midi</b>, avec wings de poulet ou basse-côte et frites',
            "<strong>DJ contest, Vinyle Attitude et Life Street Art</strong> de 14h à 18h",
            "<strong>Apéritif musical</strong> à partir de 18h30 et première partie avec « <b>Stac</b> »",
            'Le soir, <b>repas « 69 » avec menus plat-dessert-café</b> au choix (<a href="reservation" title="Réservez vos repas dès à présent">sur réservation</a>, places limitées)',
            "<strong>Concert</strong> avec le groupe <strong>« Woodstock Generation »</strong> à partir de 22h30"
        ];

        vm.dimanche = [
            // '<a href="brassage">Brassage public participatif</a> (inscription obligatoire, places limitées)',
            '<a href="bike-contest"><b>Bike Contest</b></a> ouvert à tous les possesseurs de motos customs et <strong>jeux bikers</strong> (course de lenteur, concours de bras de fer…) avec nombreux lots à gagner !',
            "Zone d'<b>expo-vente</b> de motos customs et voitures américaines réservée aux particuliers",
            "Exposition de <b>voitures</b> (rassemblement place de la mairie d'Aurignac à 10h) et <b>motos collectors</b>",
            '<b>Rassemblement de MINI</b> pour leur 60ème anniversaire et d’autres <b>voitures symboles des années hippies</b> (4L, Méhari, Cox, Combi,…)',
            '<b>Apéritif musical</b> à partir de 11h avec « <b>Stac</b> »',
            'Le midi, <b>repas « 69 » avec menus plat-dessert-café</b> au choix (<a href="reservation" title="Réservez vos repas dès à présent">sur réservation</a>, places limitées)',
            "Concert <b>Tribute to Deep Purple</b> à partir de 14h30 avec « <b>Deep Impact</b> »",
            "Circuits balades libres pour les motards et animations sécurité routière",
            "À 17h, résultats du <strong>concours de bière</strong> officiel d'Aurignac Sous Pression 2019 et remise du <strong>brassin d'or</strong> à la bière préférée du public"
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
