(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .constant('ESTADO_PAROS', { SIN_ESTADO: 0, ERROR: -1, CON_PAROS: 1, SIN_PAROS: 2 })
        .constant('ESTADO_VALIDACION_ORDEN', { NO_VALIDADA: 0, ERROR: -1, VALIDA: 1, NO_ENCONTRADA: 2 });
})();