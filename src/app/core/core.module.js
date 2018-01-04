(function () {
    'use strict';
    paypal.Button.driver('angular', window.angular);

    angular
        .module('aurignac.core', [
        /* Angular modules */
            "ngSanitize", "ngAnimate",

        /* 3rd parties modules */
            "ui.router",
            "mgcrea.ngStrap",
            "firebase",
            "ngMap",
            "angulartics",
            "angulartics.google.analytics",
            "paypal-button"
        ])

        // .constant("FIREBASE_URL", "https://aurignacsouspression.firebaseio.com/")
        // .constant("CDN_IMAGES", "http://cdn.aurignacsouspression.fr/img/")
        .config(magnificPopupConfig);

    function magnificPopupConfig() {
        angular.merge($.magnificPopup.defaults, {
            tClose: 'Fermer (Echap)',
            tLoading: 'Chargement...',
            gallery: {
                tPrev: 'Précédent (Flèche gauche)',
                tNext: 'Suivant (Flèche droite)',
                tCounter: '%curr% sur %total%'
            },
            image: {
                tError: '<a href="%url%">L\'image</a> n\'a pas pu être récupérée.'
            },
            ajax: {
                tError: '<a href="%url%">La requête</a> a échoué.'
            }
        });
    }

})();
