(function () {
    "use strict";

    angular
        .module("aurignac.contact")
        .controller("ContactController", ContactController);

    ContactController.$inject = ["api", "vcRecaptchaService"];
    function ContactController(api, vcRecaptchaService) {
        var vm = this;
        vm.send = send;
        vm.setCaptchaResponse = setCaptchaResponse;

        vm.header = {
            title: "Nous contacter"
        };

        ///////////////////////

        /**
         * Appelée lors de la soumission du formulaire de contact
         */
        function send() {
            delete vm.success;
            delete vm.failure;

            // var captcha = vcRecaptchaService.getResponse();
            if (!vm.captchaResponse) {
                vm.failure = true;
                return;
            }

            api.contact(vm.form, vm.captchaResponse)
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
