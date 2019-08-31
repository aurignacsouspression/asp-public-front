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
        vm.tshirts = [
            {
                sku: "TEE_1",
                name: "Modèle 1",
                price: 12,
                selectedSize: defaultSize,
                img: 'img/2019/shirt.png'
            },
            {
                sku: "TEE_2",
                name: "Modèle 2",
                price: 12,
                selectedSize: defaultSize,
                img: 'img/2019/shirt.png'
            },
            {
                sku: "TEE_3",
                name: "Modèle 3",
                price: 12,
                selectedSize: defaultSize,
                img: 'img/2019/shirt.png'
            },
            {
                sku: "TEE_4",
                name: "Modèle 4",
                price: 12,
                selectedSize: defaultSize,
                img: 'img/2019/shirt.png'
            },
            {
                sku: "TEE_5",
                name: "Modèle 5",
                price: 12,
                selectedSize: defaultSize,
                img: 'img/2019/shirt.png'
            },
            {
                sku: "TEE_6",
                name: "Modèle 6",
                price: 12,
                selectedSize: defaultSize,
                img: 'img/2019/shirt.png'
            },
            {
                sku: "TEE_7",
                name: "Modèle 7",
                price: 12,
                selectedSize: defaultSize,
                img: 'img/2019/shirt.png'
            },
            {
                sku: "TEE_8",
                name: "Modèle 8",
                price: 12,
                selectedSize: defaultSize,
                img: 'img/2019/shirt.png'
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

        vm.cart = [];

        vm.paypal = paypalOptions();

        //////////////////////

        /**
         * Add tee to cart
         */
        function addToCart(tee) {
            var alreadyAdded = vm.cart
                .find(function (t) { return t.sku === tee.sku && t.size === tee.selectedSize; });

            if (alreadyAdded) {
                alreadyAdded.quantity++;
            } else {
                vm.cart.push({
                    sku:      tee.sku,
                    size:     tee.selectedSize,
                    quantity: 1,
                    price:    tee.price,
                    name:     tee.name
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
            const tee = vm.cart[index];
            if (tee.quantity === 1) {
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

            vm.cart.forEach(function (t) {
                parsedData.push({
                    sku:         t.sku,
                    name:        t.name + ' - ' + getSizeName(t.size),
                    quantity:    t.quantity.toString(),
                    unit_amount: generateAmout(t.price)
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
                        $state.go('confirmation');
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
