(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('RechazoService', RechazoService);

    RechazoService.$inject = ['$http'];

    function RechazoService($http)
    {
        var service = {};

        service.ObtenerRechazos = ObtenerRechazos;
        service.ObtenerRechazo = ObtenerRechazo;
        service.CrearRechazo = CrearRechazo;
        service.ActualizarRechazo = ActualizarRechazo;
        service.EliminarRechazo = EliminarRechazo;

        return service;

        function ObtenerRechazos(indiceProceso) {
            return $http.get('/Rechazo/ObtenerRechazosPorProceso?IndiceProceso=' + indiceProceso).then(handleSuccess, handleError);
        }

        function ObtenerRechazo(id) {
            return $http.get('/Rechazo/ObtenerRechazo' + id).then(handleSuccess, handleError);
        }

        function CrearRechazo(Rechazo) {
            return $http.post('/Rechazo/CrearRechazo', Rechazo).then(handleSuccess, handleError);
        }

        function ActualizarRechazo(Rechazo) {
            return $http.put('/Rechazo/ActualizarRechazo' + Rechazo.id, Rechazo).then(handleSuccess, handleError);
        }

        function EliminarRechazo(id) {
            return $http.delete('/Rechazo/EliminarRechazo' + id).then(handleSuccess, handleError);
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