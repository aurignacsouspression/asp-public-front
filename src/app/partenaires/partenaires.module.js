(function () {
    "use strict";

    angular
        .module("aurignac.partenaires", [])
        .run(appRun);

    appRun.$inject = ["routerHelper"];
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: "partenaires",
                config: {
                    url: "/partenaires",
                    templateUrl: "app/partenaires/partenaires.html",
                    controller: "PartenairesController",
                    controllerAs: "partenaires",
                    data: { pageTitle: "Nos partenaires" }
                }
            }
        ];
    }

})();
