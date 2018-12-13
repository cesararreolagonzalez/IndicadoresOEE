(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('ParoService', ParoService);

    ParoService.$inject = ['$http'];

    function ParoService($http)
    {
        var service = {};

        service.ObtenerParosPorProceso = ObtenerParosPorProceso;
        service.ObtenerParosPorGerarquia = ObtenerParosPorGerarquia;
        service.ObtenerParosPorGerarquia1 = ObtenerParosPorGerarquia1;
        service.CrearParo = CrearParo;
        service.ActualizarParo = ActualizarParo;
        service.EliminarParo = EliminarParo;

        return service;

        function ObtenerParosPorProceso(indiceProceso) {
            return $http.get('/Paro/ObtenerParosPorProceso?IndiceProceso=' + indiceProceso).then(handleSuccess, handleError);
        }

        function ObtenerParosPorGerarquia(indiceParo, indiceProceso) {
            return $http.get('/Paro/ObtenerParosPorGerarquia?IndiceParo=' + indiceParo + '&IndiceProceso=' + indiceProceso).then(handleSuccess, handleError);
        }

        function ObtenerParosPorGerarquia1(indiceParo, indiceProceso) {
            return $http.get('/Paro/ObtenerParosPorGerarquia1?IndiceParo=' + indiceParo + '&IndiceProceso=' + indiceProceso).then(handleSuccess, handleError);
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