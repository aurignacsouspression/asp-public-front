(function () {
    "use strict";

    angular
        .module("aurignac.brasseurs", [])
        .run(appRun);

    appRun.$inject = ["routerHelper"];
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: "brasseurs",
                config: {
                    url: "/brasseurs",
                    templateUrl: "app/brasseurs/brasseurs.html",
                    controller: "BrasseursController",
                    controllerAs: "brasseurs",
                    data: { pageTitle: "Les brasseurs" }
                }
            },
            {
                state: "brasseur",
                config: {
                    url: "/brasseurs/:id",
                    templateUrl: "app/brasseurs/brasseur.html",
                    controller: "BrasseurController",
                    controllerAs: "brasseur",
                    resolve: {
                        brewer: ["brewers", "$stateParams", "$rootScope", function (brewers, $stateParams, $rootScope) {
                            return brewers.getListAsObject().then(function (brewers) {
                                var brewer = brewers[$stateParams.id];
                                $rootScope.nextTitle = brewer.name;
                                return brewer;
                            });
                        }]
                    }
                }
            }
        ];
    }

})();
