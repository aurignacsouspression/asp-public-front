(function () {
    "use strict";

    angular
        .module("aurignac.programme")
        .controller("BrassageController", BrassageController);

    BrassageController.$inject = ["api", "vcRecaptchaService"];
    function BrassageController(api, vcRecaptchaService) {
        var vm = this;
        vm.send = send;
        vm.setCaptchaResponse = setCaptchaResponse;

        vm.header = {
            title: "Brassage participatif",
            breadcrumb: [
                { state: "home", title: "Accueil" },
                { state: 'programme', title: 'Programme' }
            ]
        };

        vm.options = {
            days: [
                {
                    value: "Samedi",
                    label: "Samedi 3 octobre - 14h00"
                },
                {
                    value: "Dimanche",
                    label: "Dimanche 4 octobre - 10h00"
                }
            ],
            people: [1, 2, 3, 4, 5]
        };

        ///////////////////////

        /**
         * Appelée lors de la soumission du formulaire d'inscription au brassage
         */
        function send() {
            delete vm.success;
            delete vm.failure;

            // var captcha = vcRecaptchaService.getResponse();
            if (!vm.captchaResponse) {
                vm.failure = true;
                return;
            }

            vm.form.day = "Dimanche" // Seulement le dimanche comme brassage

            api.brassage(vm.form, vm.captchaResponse)
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
