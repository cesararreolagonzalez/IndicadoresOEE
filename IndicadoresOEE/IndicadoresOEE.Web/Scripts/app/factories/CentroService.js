(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('CentroService', CentroService);

    CentroService.$inject = ['$http'];

    function CentroService($http)
    {
        var service = {};

        service.ObtenerCentros = ObtenerCentros;
        service.ObtenerCentro = ObtenerCentro;
        service.CrearCentro = CrearCentro;
        service.ActualizarCentro = ActualizarCentro;
        service.EliminarCentro = EliminarCentro;

        return service;

        function ObtenerCentros() {
            return $http.get('/Centro/ObtenerCentros').then(handleSuccess, handleError);
        }

        function ObtenerCentro(id) {
            return $http.get('/Centro/ObtenerCentro' + id).then(handleSuccess, handleError('Error al intentar obtener el centro'));
        }

        function CrearCentro(centro) {
            return $http.post('/Centro/CrearCentro', centro).then(handleSuccess, handleError('Error al intentar crear el centro'));
        }

        function ActualizarCentro(centro) {
            return $http.put('/Centro/ActualizarCentro' + centro.id, centro).then(handleSuccess, handleError('Error al intentar actualizar el centro'));
        }

        function EliminarCentro(id) {
            return $http.delete('/Centro/EliminarCentro' + id).then(handleSuccess, handleError('Error al intentar eliminar el centro'));
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