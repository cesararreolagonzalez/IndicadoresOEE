(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .factory('IndicadorTiempoService', IndicadorTiempoService);

    IndicadorTiempoService.$inject = ['$http'];

    function IndicadorTiempoService($http)
    {
        var service = {};

        service.ObtenerUltimoIndicadorTiempo = ObtenerUltimoIndicadorTiempo;
        service.ActualizarIndicadorTiempo = ActualizarIndicadorTiempo;

        return service;

        // #region Service Methods
        function ObtenerUltimoIndicadorTiempo(IndiceProceso) {
            return $http.get('/Indicador_Tiempo/ObtenerUltimoIndicadorTiempo?IndiceProceso=' + IndiceProceso)
                .then(manejoExitoso, manejoError);
        }

        function ActualizarIndicadorTiempo(IndiceProceso, Model) {
            return $http.put('/Indicador_Tiempo/ActualizarIndicadorTiempo?' + IndiceProceso, Model)
                        .then(manejoExitoso, manejoError);
        }
        // #endregion
        // #region Private Methods
        function manejoExitoso(response) {
            return response;
        }

        function manejoError(error) {
            return error;
        }
        // #endregion
    }

})();