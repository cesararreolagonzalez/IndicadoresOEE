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

        function ObtenerCentros()
        {
            return $http.get('/Centro/ObtenerCentros').then(ManejoExito, ManejoError);
        }

        function ObtenerCentro(id)
        {
            return $http.get('/Centro/ObtenerCentro' + id).then(ManejoExito, ManejoError);
        }

        function CrearCentro(centro)
        {
            return $http.post('/Centro/CrearCentro', centro).then(ManejoExito, ManejoError);
        }

        function ActualizarCentro(centro)
        {
            return $http.put('/Centro/ActualizarCentro' + centro.id, centro).then(ManejoExito, ManejoError);
        }

        function EliminarCentro(id)
        {
            return $http.delete('/Centro/EliminarCentro' + id).then(ManejoExito, ManejoError);
        }
        
        function ManejoExito(response) {
            return response;
        }
        
        function ManejoError(error) {
            return error;
            //return function () {
            //    return { success: false, message: error };
            //};
        }

    }

})();