(function () {
    "use strict";

    angular
        .module("aurignac.programme")
        .controller("BikeContestController", BikeContestController);

    BikeContestController.$inject = ["api", "vcRecaptchaService"];
    function BikeContestController(api, vcRecaptchaService) {
        var vm = this;
        vm.send = send;
        vm.setCaptchaResponse = setCaptchaResponse;

        vm.header = {
            title: "Participez au Bike Contest !",
            breadcrumb: [
                { state: "home", title: "Accueil" },
                { state: 'programme', title: 'Programme' }
            ]
        };

        ///////////////////////

        /**
        * Appelée lors de la soumission du formulaire d'incription pour les voitures
        */
        function send() {
            delete vm.success;
            delete vm.failure;

            // var captcha = vcRecaptchaService.getResponse();
            if (!vm.captchaResponse) {
                vm.failure = true;
                return;
            }

            api.bikeContest(vm.form, vm.captchaResponse)
                .then(function (response) {
                    delete vm.form;
                    vm.success = true;
                })
                .catch(function (error) {
                    vm.failure = true;
                });
        }

        /**
         * Enregistre la réponse du captcha après sa validation pour envoi ultérieur au serveur
         */
        function setCaptchaResponse(response) {
            vm.captchaResponse = response;
        }
    }

})();
