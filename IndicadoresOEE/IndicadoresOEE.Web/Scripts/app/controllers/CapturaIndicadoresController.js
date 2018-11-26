(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .controller('CapturaIndicadoresController', CapturaIndicadoresController);
    
    CapturaIndicadoresController.$inject = ['$scope', '$timeout', '$location', '$anchorScroll', '$log', '$http', '$window', '$compile', '$mdToast', '$mdDialog'];

    function CapturaIndicadoresController($scope, $timeout, $location, $anchorScroll, $log, $http, $window, $compile, $mdToast, $mdDialog)
    {
        $scope.DatosGenerales = { IndiceCentro: '' };

        $scope.ListaCentros = [
            { Nombre: 'PI01', Indice: 1 },
            { Nombre: 'PI02', Indice: 2 },
            { Nombre: 'PI03', Indice: 3 },
            { Nombre: 'PI04', Indice: 4 },
            { Nombre: 'PI05', Indice: 5 },
            { Nombre: 'PI06', Indice: 6 }
        ];

        $scope.ListaDepartamentos = [
            { Nombre: 'PI01', Indice: 1, IndiceCentro: 1 },
            { Nombre: 'PI02', Indice: 2, IndiceCentro: 1},
            { Nombre: 'PI03', Indice: 3, IndiceCentro: 1},
            { Nombre: 'PI04', Indice: 4, IndiceCentro: 1},
            { Nombre: 'PI05', Indice: 5, IndiceCentro: 1},
            { Nombre: 'PI06', Indice: 6, IndiceCentro: 1}
        ];

        $scope.ListaDepartamentos = [
            { Nombre: 'PI01', Indice: 1, IndiceCentro: 1 },
            { Nombre: 'PI02', Indice: 2, IndiceCentro: 1},
            { Nombre: 'PI03', Indice: 3, IndiceCentro: 1},
            { Nombre: 'PI04', Indice: 4, IndiceCentro: 1},
            { Nombre: 'PI05', Indice: 5, IndiceCentro: 1},
            { Nombre: 'PI06', Indice: 6, IndiceCentro: 1}
        ];

        $scope.ResetearTerminoBusqueda = function () {
            $scope.TerminoBusqueda = '';
        };
    }
}) ();