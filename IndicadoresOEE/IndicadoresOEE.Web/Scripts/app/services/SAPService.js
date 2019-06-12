(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('SAPService', SAPService);

    SAPService.$inject = ['$http'];

    function SAPService($http)
    {
        var service = {};

        service.ValidacionOrden = ValidacionOrden;

        return service;

        function ValidacionOrden(Orden) {
            return $http.get('/SAP/ValidacionOrden?Orden=' + Orden).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(response) {
            return response;
        }

        function handleError(error) {
            console.log(error);
            return error;
            //return function () {
            //    return { success: false, message: error };
            //};
        }
    }

})();