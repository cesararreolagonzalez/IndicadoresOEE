﻿(function () {
    'use strict';

    angular.module('indicadoresoeeapp', ['ngMaterial', 'ngMessages', 'ngSanitize', 'angularMoment'])

        .config(['$mdIconProvider', '$mdDateLocaleProvider', '$mdThemingProvider',
            function ($mdIconProvider, $mdDateLocaleProvider, $mdThemingProvider)
            {
                //==============================================================================

                //$mdIconProvider.icon('md-close', '../img/icons/ic_close_24px.svg', 24);
                
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
                        var dia = date.getDate();
                        //console.log('Dia = ' + dia);
                        var nombreDia = dia > 9 ? dia : '0' + dia;
                        var indiceMes = date.getMonth();
                        var año = date.getFullYear();

                        var nombreMes = '';
                        switch (indiceMes + 1) {
                            case 1: nombreMes = 'Enero'; break;
                            case 2: nombreMes = 'Febrero'; break;
                            case 3: nombreMes = 'Marzo'; break;
                            case 4: nombreMes = 'Abril'; break;
                            case 5: nombreMes = 'Mayo'; break;
                            case 6: nombreMes = 'Junio'; break;
                            case 7: nombreMes = 'Julio'; break;
                            case 8: nombreMes = 'Agosto'; break;
                            case 9: nombreMes = 'Septiembre'; break;
                            case 10: nombreMes = 'Octubre'; break;
                            case 11: nombreMes = 'Noviembre'; break;
                            case 12: nombreMes = 'Diciembre'; break;
                        }

                        return nombreDia + '/' + nombreMes + '/' + año;
                    }

                    return '';
                };
            }])
            .run(function (amMoment) {
                amMoment.changeLocale('es');
            });
})();