(function () {
    "use strict";

    angular
        .module("aurignac")
        .controller("ReservationController", ReservationController);

    ReservationController.$inject = ["$state", "usSpinnerService"];
    function ReservationController($state, usSpinnerService) {
        var vm = this;
        vm.addRepas = addRepas;
        vm.removeRepas = removeRepas;

        // Objet contenant les infos du header de la page (titre et fil d'ariane si nécessaire)
        vm.header = {
            title: "Réserver les repas",
            // breadcrumb: [{link: "/", class: "active", title: "Accueil"}]
        };

        vm.meals = [
            "« Ribs de Porc et Riz façon Jambalaya » : un incontournable du pays de l'oncle Sam !",
            '« Chilli con Carne » : pour ceux qui aiment le "spicy" et/ou se rêvent cowboy au Texas'
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
            function generateAmout(value) {
                return {
                    value: value.toString(),
                    currency_code: 'EUR'
                }
            }

            var parsedData = [{
                sku: "0000",
                name: "Frais Paypal",
                quantity: "1",
                unit_amount: generateAmout(vm.paypalAmount)
            }];

            vm.repas.forEach(function (day, index) {
                day.meals.forEach(function (quantity, quantityIndex) {
                    if (quantity) {
                        parsedData.push({
                            sku: day.sku + quantityIndex,
                            name: day.name + ' - ' + vm.meals[quantityIndex],
                            quantity: quantity.toString(),
                            unit_amount: generateAmout(day.price)
                        });
                    }
                });
            });

            var total = generateAmout(
                vm.repas[0].quantity * vm.repas[0].price + vm.repas[1].quantity * vm.repas[1].price + vm.paypalAmount
            );

            var purchase_units = [{
                items: parsedData,
                amount: Object.assign(
                    {},
                    total,
                    { breakdown: { item_total: total } }
                ),
                description: "Repas Aurignac Sous Pression"
            }];

            return purchase_units;
            // return api.approvePaypal(transactions);
        }

        function paypalOptions() {
            return {
                style: {
                    color: 'black',
                    label: 'pay',
                    tagline: false,
                    height: 40
                },

                createOrder: function (data, actions) {
                    return actions.order.create({
                        purchase_units: checkout(),
                        application_context: {
                            shipping_preference: 'NO_SHIPPING'
                        }
                    });
                },

                onApprove: function (data, actions) {
                    usSpinnerService.spin('overlay');
                    return actions.order.capture().then(function (payment) {
                        usSpinnerService.stop('overlay');
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
                    return parseFloat((0.35 + (this.repas[0].quantity + this.repas[1].quantity) * 16 * 0.029).toFixed(2));
                }
            }
        });

})();
