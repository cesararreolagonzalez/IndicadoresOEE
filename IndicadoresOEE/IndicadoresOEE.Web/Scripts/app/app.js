(function () {
    'use strict';

    angular.module('indicadoresoeeapp', ['ngMaterial', 'ngMessages', 'ngSanitize', 'angularMoment'])

        .config(['$mdIconProvider', '$mdDateLocaleProvider', '$mdThemingProvider', '$routeProvider', '$urlRouterProvider', '$stateProvider',
            function ($mdIconProvider, $mdDateLocaleProvider, $mdThemingProvider, $routeProvider, $urlRouterProvider, $stateProvider) {
                $mdIconProvider.icon('md-close', '../img/icons/ic_close_24px.svg', 24);

                // Example of a Spanish localization.
                $mdDateLocaleProvider.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                $mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                $mdDateLocaleProvider.days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
                $mdDateLocaleProvider.shortDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
                // Can change week display to start on Monday.
                $mdDateLocaleProvider.firstDayOfWeek = 1;

                $mdDateLocaleProvider.weekNumberFormatter = function (weekNumber) {
                    return 'Semana ' + weekNumber;
                };
                $mdDateLocaleProvider.msgCalendar = 'Calendario';
                $mdDateLocaleProvider.msgOpenCalendar = 'Abrir calendario';

                $mdDateLocaleProvider.formatDate = function (date) {
                    if (date !== undefined && date !== null && date !== '') {
                        var day = date.getDate();
                        var monthIndex = date.getMonth();
                        var year = date.getFullYear();

                        return day + '/' + (monthIndex + 1) + '/' + year;
                    }

                    return '';
                };
                
                //$urlRouterProvider.otherwise("inicio");

                //$stateProvider
                //    .state('inicio', {
                //        url: "/",
                //        templateUrl: "/Inicio/Inicio"
                //    })
                //    .state('crear-indicador', {
                //        url: "/indicador/captura-individual",
                //        templateUrl: "/Indicadores/Captura",
                //        controller: "CapturaIndicadoresController"
                //    });

                ////$routeProvider
                ////    .when('/', {
                ////        templateUrl: '/Inicio/Inicio',
                ////        controller: ''
                ////    })
                ////    .when('/indicadores/captura-individual', {
                ////        templateUrl: '/Indicadores/Captura',
                ////        controller: 'CapturaIndicadoresController'
                ////    })
                ////    .otherwise({
                ////        redirectTo: '/'
                ////    });
            }]);
})();