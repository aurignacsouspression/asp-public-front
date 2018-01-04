(function () {
    "use strict";

    angular
        .module("aurignac.programme", [])
        .run(appRun);

    appRun.$inject = ["routerHelper"];
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: "programme",
                config: {
                    url: "/programme",
                    templateUrl: "app/programme/programme.html",
                    controller: "ProgrammeController",
                    controllerAs: "programme",
                    data: { pageTitle: "Programme détaillé" }
                }
            },
            {
                state: "concours",
                config: {
                    url: "/concours",
                    templateUrl: "app/programme/concours.html",
                    data: { pageTitle: "Concours de bière" }
                }
            },
            {
                state: "brassage",
                config: {
                    url: "/brassage",
                    templateUrl: "app/programme/brassage.html",
                    controller: "BrassageController",
                    controllerAs: "brassage",
                    data: { pageTitle: "Brassage participatif" }
                }
            },
            {
                state: "expo-voiture",
                config: {
                    url: "/exposition-voiture",
                    templateUrl: "app/programme/exposants-voitures.html",
                    controller: "ExpoVoituresController",
                    controllerAs: "expo",
                    data: { pageTitle: "Exposez votre véhicule" }
                }
            },
            {
                state: "bike-contest",
                config: {
                    url: "/bike-contest",
                    templateUrl: "app/programme/bike-contest.html",
                    controller: "BikeContestController",
                    controllerAs: "contest",
                    data: { pageTitle: "Participez au Bike Contest" }
                }
            }
        ];
    }

})();
