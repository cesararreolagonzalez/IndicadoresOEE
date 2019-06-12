(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('PerfilService', PerfilService);

    PerfilService.$inject = ['$http'];

    function PerfilService($http)
    {
        var service = {};

        service.ObtenerPerfiles = ObtenerPerfiles;
        service.ObtenerPerfil = ObtenerPerfil;
        service.AgregarPerfil = AgregarPerfil;
        service.ActualizarPerfil = ActualizarPerfil;
        service.EliminarPerfil = EliminarPerfil;

        return service;

        function ObtenerPerfiles()
        {
            return $http.get('/Perfil/ObtenerPerfiles').then(ManejoExito, ManejoError);
        }

        function ObtenerPerfil(id)
        {
            return $http.get('/Perfil/ObtenerPerfil' + id).then(ManejoExito, ManejoError);
        }

        function AgregarPerfil(model)
        {
            return $http.post('/Perfil/AgregarPerfil', model).then(ManejoExito, ManejoError);
        }

        function ActualizarPerfil(model)
        {
            return $http.put('/Perfil/ActualizarPerfil' + model.id, model).then(ManejoExito, ManejoError);
        }

        function EliminarPerfil(id)
        {
            return $http.delete('/Perfil/EliminarPerfil' + id).then(ManejoExito, ManejoError);
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