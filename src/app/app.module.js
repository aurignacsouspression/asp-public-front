(function () {
    "use strict";

    angular
        .module("aurignac", [
            "blocks.router",

            "aurignac.config",

            "aurignac.core",
            "aurignac.layout",
            "aurignac.contact",
            "aurignac.programme",
            "aurignac.brasseurs",
            "aurignac.partenaires"
        ])
        .config(routerConfig)
        .run(scrollToTop);

    routerConfig.$inject = ["$stateProvider", "$locationProvider", "$urlRouterProvider", "$urlMatcherFactoryProvider"];
    function routerConfig($stateProvider, $locationProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        // $locationProvider.html5Mode(true).hashPrefix("!");
        $urlMatcherFactoryProvider.caseInsensitive(true);

        $stateProvider
            .state("home", {
                url: "/",
                controller: "AccueilController",
                controllerAs: "accueil",
                templateUrl: "app/accueil/accueil.html"
            })
        // .state("hebergements", {
        //     url: "/hebergements",
        //     controller: "HebergementController",
        //     controllerAs: "hebergement",
        //     templateUrl: "app/Hebergements/hebergements.html"
        // })
        // .state("hebergement", {
        //     url: "/hebergements/:id",
        //     controller: "HebergementController",
        //     controllerAs: "hebergement",
        //     templateUrl: "app/Hebergements/hebergement.html"
        // })
            .state("contact", {
                url: "/contact",
                templateUrl: "app/contact/contact.html",
                controller: "ContactController",
                controllerAs: "contact",
                data: { pageTitle: "Nous contacter" }
            })

            .state("reservation", {
                url: "/reservation",
                templateUrl: "app/reservations/reservation.html",
                controller: "ReservationController",
                controllerAs: "resa",
                data: { pageTitle: "Réservations" }
            })
            .state("charging", {
                url: "/paiement",
                templateUrl: "app/reservations/charging.html",
                controller: "PaymentController",
                controllerAs: "payment",
                data: { pageTitle: "Paiement en cours..." }
            })
            .state("confirmation", {
                url: "/reservation/ok",
                templateUrl: "app/reservations/confirmation.html",
                data: { pageTitle: "Réservation confirmée" }
            })

//             .state("presse", {
//                 url: "/presse",
//                 controller: "ArticlesController",
//                 controllerAs: "article",
//                 templateUrl: "app/Revue-de-presse/revue-de-presse.html"
//             })
//             .state("partenaire", {
//                 url: "/partenaires/:id",
//                 controller: "PartenaireController",
//                 controllerAs: "partenaire",
//                 templateUrl: "app/Partenaires/partenaire.html"
//             })
//             .state("moto", {
//                 url: "/moto",
//                 controller: "MotosController",
//                 controllerAs: "stand",
//                 templateUrl: "app/Stand-Motos/stand-motos.html"
//             })
//
//             .state("images", {
//                 url: "/images",
//                 templateUrl: "app/Images/en-images.html"
//             })
//             .state("/images/annee/", {
//                 templateUrl: "app/Images/images-annee-precedentes.html"
//             })
//             .state("/images/annee/2013", {
//                 templateUrl: "app/Images/images-2013.html"
//             })
//             .state("/images/annee/2014", {
//                 templateUrl: "app/Images/images-2014.html"
//             })
//             .state("/images/affiches", {
//                 templateUrl: "app/Images/images-affiches.html"
//             })
//             .state("/images/brasseurs", {
//                 templateUrl: "app/Images/images-brasseurs.html"
//             })
//             .state("/images/facebook", {
//                 templateUrl: "app/Images/images-facebook.html"
//             })
//             .state("/images/logos", {
//                 templateUrl: "app/Images/images-logos.html"
//             })
//             .state("/images/motos", {
//                 templateUrl: "app/Images/images-motos.html"
//             })
//             .state("/images/partenaires", {
//                 controller: "PartenaireController",
//                 controllerAs: "partenaire",
//                 templateUrl: "app/Images/images-partenaires.html"
//             })
             .state("presentation", {
                url: "/presentation",
                templateUrl: "app/presentation/presentation.html",
                controller: "PresentationController",
                controllerAs: "presentation",
                data: { pageTitle: "A propos" }
             });

            $urlRouterProvider.otherwise("/");
    }

    scrollToTop.$inject = ["$rootScope", "$location", "$anchorScroll"];
    function scrollToTop($rootScope, $location, $anchorScroll) {
        $rootScope.$on('$stateChangeSuccess', function() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            if($location.hash()) $anchorScroll();
        });
    }

})();
