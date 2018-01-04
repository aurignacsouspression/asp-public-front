(function () {
    'use strict';

    angular
        .module('aurignac.core')
        .factory('api', api);

    api.$inject = ['$http', 'PAYPAL_RETURN_URL', 'PAYPAL_CANCEL_URL'];
    function api($http, PAYPAL_RETURN_URL, PAYPAL_CANCEL_URL) {
        var service = {
            contact: contact,
            brassage: brassage,
            expoVoitures: expoVoitures,
            bikeContest: bikeContest,
            approvePaypal: approvePaypal,
            chargePaypal: chargePaypal
        };

        return service;

        ///////////////////////

        /**
         * Requête POST au serveur avec les données du formulaire de contact
         * @param {Object} form - Données du formulaire
         * @param {String} captcha
         * @returns {Promise}
         */
        function contact(form, captcha) {
            var data = {
                sender: { name: form.username, email: form.email },
                subject: form.subject,
                text: form.text,
                captcha: captcha,
                sendCopy: form.sendCopy
            };

            return $http.post('/api/contact', data);
                // .then(function (response) {
                //     console.log('success');
                // })
                // .catch(function (error) {
                //     console.log(error);
                // });
        }

        /**
         * Requête POST au serveur avec les données du formulaire de brassage
         * @param {Object} form - Données du formulaire
         * @param {String} captcha
         * @returns {Promise}
         */
        function brassage(form, captcha) {
            var data = {
                sender: { name: form.username, email: form.email },
                details: { day: form.day, number: form.number },
                captcha: captcha
            };

            return $http.post('/api/brassage', data);
        }

        /**
         * Requête POST au serveur avec les données du formulaire pour les exposants voiture
         * @param {Object} form - Données du formulaire
         * @param {String} captcha
         * @returns {Promise}
         */
        function expoVoitures(form, captcha) {
            var data = {
                sender: { name: form.driver, email: form.email },
                details: { passenger: form.passenger, phone: form.phone, vehicle: form.vehicle, year: form.year, particularities: form.particularities },
                captcha: captcha
            };

            return $http.post('/api/expo', data);
        }

        /**
         * Requête POST au serveur avec les données du formulaire pour le bike contest
         * @param {Object} form - Données du formulaire
         * @param {String} captcha
         * @returns {Promise}
         */
        function bikeContest(form, captcha) {
            var data = {
                sender: { name: form.name, email: form.email },
                details: { phone: form.phone, vehicle: form.vehicle, year: form.year },
                captcha: captcha
            };

            return $http.post('/api/bike-contest', data);
        }

        function approvePaypal(transactions) {
            var data = {
                transactions: transactions,
                urls: {
                    return_url: PAYPAL_RETURN_URL,
                    cancel_url: PAYPAL_CANCEL_URL
                }
            };

            return $http.post('/api/checkout', data);
        }

        function chargePaypal(payerId, paymentId) {
            return $http.post('/api/charge', { payerId: payerId, paymentId: paymentId });
        }
    }

})();
