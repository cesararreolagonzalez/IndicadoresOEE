(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('ParoService', ParoService);

    ParoService.$inject = ['$http'];

    function ParoService($http)
    {
        var service = {};

        service.ObtenerParos = ObtenerParos;
        service.ObtenerParo = ObtenerParo;
        service.CrearParo = CrearParo;
        service.ActualizarParo = ActualizarParo;
        service.EliminarParo = EliminarParo;

        return service;

        function ObtenerParos(indiceProceso) {
            return $http.get('/Paro/ObtenerParosPorProceso?IndiceProceso=' + indiceProceso).then(handleSuccess, handleError);
        }

        function ObtenerParo(id) {
            return $http.get('/Paro/ObtenerParo' + id).then(handleSuccess, handleError);
        }

        function CrearParo(Paro) {
            return $http.post('/Paro/CrearParo', Paro).then(handleSuccess, handleError);
        }

        function ActualizarParo(Paro) {
            return $http.put('/Paro/ActualizarParo' + Paro.id, Paro).then(handleSuccess, handleError);
        }

        function EliminarParo(id) {
            return $http.delete('/Paro/EliminarParo' + id).then(handleSuccess, handleError);
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