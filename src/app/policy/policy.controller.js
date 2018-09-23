(function() {
  "use strict";
  angular
    .module("aurignac")
    .controller("PolicyController", PolicyController);

  function PolicyController() {
    var vm = this;
    vm.header = {
      title: "Mentions légales"
    };
  }
})();