(function () {
    "use strict";

    angular
        .module("aurignac")
        .controller("ShopController", ShopController);

    ShopController.$inject = ["$state", "usSpinnerService"];
    function ShopController($state, usSpinnerService) {
        var vm = this;
        vm.addToCart              = addToCart;
        vm.getSizeName            = getSizeName;
        vm.getCartItemsTotalPrice = getCartItemsTotalPrice;
        vm.removeItemFromCart     = removeItemFromCart;

        // Objet contenant les infos du header de la page (titre et fil d'ariane si nécessaire)
        vm.header = {
            title: "Boutique",
            // breadcrumb: [{link: "/", class: "active", title: "Accueil"}]
        };

        var defaultSize = "10";
        var defaultTreePrice = 15;
        var tshirts = [
            {
                sku: "TEE_1_BLANC",
                name: "Modèle 1 - Blanc",
                price: defaultTreePrice,
                selectedSize: defaultSize,
            },
            {
                sku: "TEE_1_NOIR",
                name: "Modèle 1 - Noir",
                price: defaultTreePrice,
                selectedSize: defaultSize,
            },
            {
                sku: "TEE_2_BLANC",
                name: "Modèle 2 - Blanc",
                price: defaultTreePrice,
                selectedSize: defaultSize,
            },
            {
                sku: "TEE_2_NOIR",
                name: "Modèle 2 - Noir",
                price: defaultTreePrice,
                selectedSize: defaultSize,
            },
            {
                sku: "TEE_3_BLANC",
                name: "Modèle 3 - Blanc",
                price: defaultTreePrice,
                selectedSize: defaultSize,
            },
            {
                sku: "TEE_3_NOIR",
                name: "Modèle 3 - Noir",
                price: defaultTreePrice,
                selectedSize: defaultSize,
            },
            {
                sku: "TEE_4_BLANC",
                name: "Modèle 4 - Blanc",
                price: defaultTreePrice,
                selectedSize: defaultSize,
            },
            {
                sku: "TEE_4_NOIR",
                name: "Modèle 4 - Noir",
                price: defaultTreePrice,
                selectedSize: defaultSize,
            },
            {
                sku: "TEE_5",
                name: "Modèle 5",
                price: defaultTreePrice,
                selectedSize: defaultSize,
                description: "Couleur gris chiné"
            },
            {
                sku: "TEE_6",
                name: "Modèle 6",
                price: defaultTreePrice,
                selectedSize: defaultSize,
                description: "Couleur gris chiné"
            },
            {
                sku: "TEE_7_BLANC",
                name: "Modèle 7 - Blanc",
                price: defaultTreePrice,
                selectedSize: defaultSize,
            },
            {
                sku: "TEE_7_NOIR",
                name: "Modèle 7 - Noir",
                price: defaultTreePrice,
                selectedSize: defaultSize,
            },
            {
                sku: "TEE_8_BLANC",
                name: "Modèle 8 - Blanc",
                price: defaultTreePrice,
                selectedSize: defaultSize,
            },
            {
                sku: "TEE_8_NOIR",
                name: "Modèle 8 - Noir",
                price: defaultTreePrice,
                selectedSize: defaultSize,
            },
            {
                sku: "TEE_9",
                name: "Modèle 9",
                price: defaultTreePrice,
                selectedSize: defaultSize,
                description: "Edition Black Mountain"
            }
        ];

        vm.sizes = [
            { id: "10", display: 'Femme - S' },
            { id: "11", display: 'Femme - M' },
            { id: "12", display: 'Femme - L' },
            { id: "13", display: 'Femme - XL' },
            { id: "20", display: 'Homme - M' },
            { id: "21", display: 'Homme - L' },
            { id: "22", display: 'Homme - XL' },
            { id: "23", display: 'Homme - XXL' },
        ];

        vm.products = {
            tshirts: {
                enabled: false,
                items: tshirts
            },
            whiskies: {
                enabled: true,
                items: [{
                    sku: "WHISKY_BM",
                    name: "Whisky Black Mountain",
                    price: 10,
                }]
            }
        };

        vm.cart = [];

        vm.paypal = paypalOptions();

        //////////////////////

        /**
         * Add item to cart
         */
        function addToCart(item) {
            var alreadyAdded = vm.cart
                .find(function (t) { return t.sku === item.sku && (t.size ? t.size === item.selectedSize : true); });

            if (alreadyAdded) {
                alreadyAdded.quantity++;
            } else {
                vm.cart.push({
                    sku:      item.sku,
                    size:     item.selectedSize,
                    quantity: 1,
                    price:    item.price,
                    name:     item.name
                });
            }
        }

        function getSizeName(id) {
            var size = vm.sizes.find(function (s) { return s.id === id; });
            return size ? size.display : id;
        }

        function getCartItemsTotalPrice() {
            return vm.cart.reduce(function (sum, i) { return sum + i.price * i.quantity; }, 0);
        }

        function removeItemFromCart(index) {
            const item = vm.cart[index];
            if (item.quantity === 1) {
                vm.cart.splice(index, 1);
            } else {
                vm.cart[index].quantity--;
            }
        }

        function paypalCheckout() {
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

            vm.cart.forEach(function (x) {
                parsedData.push({
                    sku:         x.sku,
                    name:        x.size ? x.name + ' - ' + getSizeName(x.size) : x.name,
                    quantity:    x.quantity.toString(),
                    unit_amount: generateAmout(x.price)
                });
            });

            var total = generateAmout(
                getCartItemsTotalPrice() + this.paypalAmount
            );

            var purchase_units = [{
                items: parsedData,
                amount: Object.assign(
                    {},
                    total,
                    { breakdown: { item_total: total } }
                ),
                description: "Boutique Aurignac Sous Pression"
            }];

            return purchase_units;
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
                        purchase_units: paypalCheckout.call(vm),
                        application_context: {
                            shipping_preference: 'NO_SHIPPING'
                        }
                    });
                },

                onApprove: function (data, actions) {
                    usSpinnerService.spin('overlay');
                    return actions.order.capture().then(function (payment) {
                        usSpinnerService.stop('overlay');
                        $state.go('shop-confirmation');
                    });
                }
            }
        }
    }

    Object.defineProperties(ShopController.prototype, {
        "paypalAmount": {
            enumerable: true,
            configurable: false,
            get: function () {
                return parseFloat((0.35 + this.getCartItemsTotalPrice() * 0.029).toFixed(2));
            }
        },
        "totalAmount": {
            enumerable: true,
            configurable: false,
            get: function () {
                return this.getCartItemsTotalPrice() + this.paypalAmount;
            }
        }
    })

})();
