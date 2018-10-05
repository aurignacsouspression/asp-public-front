(function () {
    "use strict";

    angular
        .module("aurignac")
        .controller("ReservationController", ReservationController);

    ReservationController.$inject = ["api", "$state"];
    function ReservationController(api, $state) {
        var vm = this;
        vm.addRepas = addRepas;
        vm.removeRepas = removeRepas;

        // Objet contenant les infos du header de la page (titre et fil d'ariane si nécessaire)
        vm.header = {
            title: "Réserver les repas",
            // breadcrumb: [{link: "/", class: "active", title: "Accueil"}]
        };

        vm.meals = [
            "« Poule au pot » : une recette emblématique des guinguettes d'autrefois",
            "« Jambon à la ficelle » : cuit pendant de longues heures, et accompagné de son gratin dauphinois"
        ];

        vm.repas = [
            {
                sku: "001",
                name: "Repas du samedi soir",
                quantity: 0,
                price: 16,
                meals: [0, 0],
                disabled: true
            }, {
                sku: "002",
                name: "Repas du dimanche midi",
                quantity: 0,
                price: 16,
                meals: [0, 0],
                disabled: true
            }
        ];

        vm.paypal = paypalOptions();

        //////////////////////

        /**
         * Incrémente la quantité pour le plat et le jour passés en paramètres
         * @param {number} day - Index du jour dans vm.repas
         * @param {number} meal - Index du plat dans vm.meals
         */
        function addRepas(day, meal) {
            vm.repas[day].quantity++;
            vm.repas[day].meals[meal]++;
        }

        /**
         * Décrémente la quantité pour le plat et le jour passés en paramètres
         * @param {number} day - Index du jour dans vm.repas
         * @param {number} meal - Index du plat dans vm.meals
         */
        function removeRepas(day, meal) {
            if (vm.repas[day]) {
                vm.repas[day].quantity--;
                vm.repas[day].meals[meal]--;
            }
        }

        function checkout() {
            var parsedData = [{
                sku: "0000",
                name: "Frais Paypal",
                quantity: "1",
                price: vm.paypalAmount.toString(),
                currency: "EUR"
            }];

            vm.repas.forEach(function (day, index) {
                day.meals.forEach(function (quantity, quantityIndex) {
                    if (quantity) {
                        parsedData.push({
                            sku: day.sku + quantityIndex,
                            name: day.name + ' - ' + vm.meals[quantityIndex],
                            quantity: quantity.toString(),
                            price: day.price.toString(),
                            currency: "EUR"
                        });
                    }
                });
            });

            var transactions = [{
                item_list: {
                    items: parsedData
                },
                amount: {
                    currency: "EUR",
                    total: (vm.repas[0].quantity * vm.repas[0].price + vm.repas[1].quantity * vm.repas[1].price + vm.paypalAmount).toString()
                },
                description: "Repas Aurignac Sous Pression"
            }];

            return transactions;
            // return api.approvePaypal(transactions);
        }

        function paypalOptions() {
            return {
                // env: 'sandbox', // Or 'sandbox'
                env: 'production', // Or 'sandbox'

                client: {
                    sandbox: 'AZ6312n_7yJY-KRiRQ5XNSnWR4EBmYQgJ1WY1LyC1SLWFuE6ljVM92JBlbI0v3pT7DtvoFl1tfKAGTQM',
                    production: 'Aap-rFAyPgwgDHm02iBmIYjwjyDmcRcEbXeacaKIrTMH1cFtbtNmfZLgfdhLBHTBcxvxxjcvdYH_84tz'
                },

                commit: true, // Show a 'Pay Now' button

                payment: function (data, actions) {
                    return actions.payment.create({
                        payment: {
                            transactions: checkout()
                        }
                    });
                },

                onAuthorize: function (data, actions) {
                    return actions.payment.execute().then(function (payment) {
                        $state.go('confirmation');
                    });
                }
            }
        }
    }

    Object.defineProperty(ReservationController.prototype,
        "paypalAmount", {
            enumerable: true,
            configurable: false,
            get: function () {
                if (this.repas) {
                    return parseFloat((0.25 + (this.repas[0].quantity + this.repas[1].quantity) * 16 * 0.034).toFixed(2));
                }
            }
        });

})();
