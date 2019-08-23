(function () { 
 return angular.module("aurignac.config", [])
.constant("FIREBASE_URL", "https://aurignacsouspression.firebaseio.com/")
.constant("CDN_IMAGES", "https://cdn.aurignacsouspression.fr/img/")
.constant("PAYPAL_RETURN_URL", "https://www.aurignacsouspression.fr/paiement")
.constant("PAYPAL_CANCEL_URL", "https://www.aurignacsouspression.fr/reservation");

})();
