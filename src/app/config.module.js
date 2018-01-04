(function () { 
 return angular.module("aurignac.config", [])
.constant("FIREBASE_URL", "https://aurignacsouspression.firebaseio.com/")
.constant("CDN_IMAGES", "http://cdn.aurignacsouspression.fr/img/")
.constant("PAYPAL_RETURN_URL", "http://www.aurignacsouspression.fr/paiement")
.constant("PAYPAL_CANCEL_URL", "http://www.aurignacsouspression.fr/reservation");

})();
