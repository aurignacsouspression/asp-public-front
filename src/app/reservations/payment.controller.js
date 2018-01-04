(function () {
  'use strict';

  angular
    .module('aurignac')
    .controller('PaymentController', PaymentController);

  PaymentController.$inject = ['api', '$location', '$timeout', '$state'];
  function PaymentController(api, $location, $timeout, $state) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
      var query = $location.search();

      if (!query.PayerID || !query.paymentId) {
        setError();
      } else {
        api
          .chargePaypal(query.PayerID, query.paymentId)
          .then(function (response) {
            if (response.status === 200) {
              // Successful checkout, go to order success.
              // $location.path('/order-processed/' + response.data.orderId);
              $state.go('confirmation');
            } else {
              setError();
            }
          })
          .catch(function () {
            setError();
          });
      }
    }

    function setError() {
      vm.error = true;
      $timeout(function () {
        $state.go('reservation');
      }, 5000);
    }
  }
})();
