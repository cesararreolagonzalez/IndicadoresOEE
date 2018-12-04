(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('LineaService', LineaService);

    LineaService.$inject = ['$http'];

    function LineaService($http)
    {
        var service = {};

        service.ObtenerLineasPorDepartamento = ObtenerLineasPorDepartamento;
        service.ObtenerLineas = ObtenerLineas;
        service.ObtenerLinea = ObtenerLinea;
        service.CrearLinea = CrearLinea;
        service.ActualizarLinea = ActualizarLinea;
        service.EliminarLinea = EliminarLinea;

        return service;

        function ObtenerLineasPorDepartamento(IndiceDepartamento) {
            return $http.get('/Linea/ObtenerLineas?IndiceDepartamento=' + IndiceDepartamento).then(handleSuccess, handleError);
        }

        function ObtenerLineas() {
            return $http.get('/Linea/ObtenerLineas').then(handleSuccess, handleError);
        }

        function ObtenerLinea(id) {
            return $http.get('/Linea/ObtenerLinea' + id).then(handleSuccess, handleError);
        }

        function CrearLinea(Linea) {
            return $http.post('/Linea/CrearLinea', Linea).then(handleSuccess, handleError);
        }

        function ActualizarLinea(Linea) {
            return $http.put('/Linea/ActualizarLinea' + Linea.id, Linea).then(handleSuccess, handleError);
        }

        function EliminarLinea(id) {
            return $http.delete('/Linea/EliminarLinea' + id).then(handleSuccess, handleError);
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