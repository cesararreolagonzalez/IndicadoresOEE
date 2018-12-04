(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('SAPService', SAPService);

    SAPService.$inject = ['$http'];

    function SAPService($http)
    {
        var service = {};

        service.ValidarOrden = ValidarOrden;

        return service;

        function ValidarOrden(Orden) {
            return $http.get('/SAP/ValidarOrden?Orden=' + Orden).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(response) {
            return response;
        }

        function handleError(error) {
            return error;
            //return function () {
            //    return { success: false, message: error };
            //};
        }
    }

})();