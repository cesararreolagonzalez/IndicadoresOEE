(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .controller('ReporteIndicadorController', ReporteIndicadorController);
    
    ReporteIndicadorController.$inject = ['$element', '$scope', '$sce', '$timeout', '$filter',
        '$anchorScroll', '$log', '$window', '$mdDialog', 'moment', 'ESTADO_PAROS',
        'CentroService', 'DepartamentoService', 'LineaService', 'ProcesoService', 'VelocidadService',
        'IndicadorService', 'SAPService', 'UtilFactory'];

    function ReporteIndicadorController($element, $scope, $sce, $timeout, $filter, $anchorScroll,
        $log, $window, $mdDialog, moment, ESTADO_PAROS,
        CentroService, DepartamentoService, LineaService,
        ProcesoService, VelocidadService, IndicadorService, SAPService, UtilFactory)
    {
        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

        var FechaHoy = new Date();

        $scope.DatosGenerales = {
            IndiceCentro: null,
            IndiceDepartamento: null,
            IndiceLinea: null,
            IndiceProceso: null,
            IndiceVelocidad: null,
            FechaInicial: new Date(FechaHoy.getFullYear(), FechaHoy.getMonth(), FechaHoy.getDate(), 0, 0, 0),
            FechaFinal: new Date(FechaHoy.getFullYear(), FechaHoy.getMonth(), FechaHoy.getDate(), 23, 59, 59)
        };
        
        $scope.TerminoBusqueda = '';

        $scope.ListaCentros = null;
        $scope.ListaDepartamentos = null;
        $scope.ListaLineas = null;
        $scope.ListaProcesos = null;
        $scope.ListaVelocidades = null;
        
        $scope.agregarParo = function (ev) {
            $mdDialog.show({
                locals: { IndiceProceso: $scope.DatosGenerales.IndiceProceso, ListaIndicesParosEnUso: $scope.ListaIndicesParosEnUso },
                controller: ['$scope', '$element', '$mdDialog', 'ParoService', 'IndiceProceso', 'ListaIndicesParosEnUso',
                    function ($scope, $element, $mdDialog, ParoService, IndiceProceso, ListaIndicesParosEnUso)
                    {
                        $element.find('input').on('keydown', function (ev) {
                            ev.stopPropagation();
                        });

                        $scope.TerminoBusqueda = '';
                        $scope.IndiceParoActual = 0;
                        $scope.HabilitarFolio = false;
                        $scope.EsUltimoNivel = false;
                        $scope.ListaNombres = [];

                        $scope.ListaParosPrimerNivel = null;
                        $scope.ListaParosSegundoNivel = null;
                        $scope.ListaParosTercerNivel = null;
                        $scope.ListaParosCuartoNivel = null;
                        $scope.ListaParosQuintoNivel = null;

                        $scope.Paro = {
                            'Indice': null,
                            'Nombre': null,
                            'Cantidad': null,
                            'Folio': null
                        };

                        $scope.IndiceParo = {
                            'Nivel01': null,
                            'Nivel02': null,
                            'Nivel03': null,
                            'Nivel04': null,
                            'Nivel05': null
                        };
                        
                        $scope.ObtenerParos = function (Nivel)
                        {
                            if (Nivel === 1)
                                $scope.IndiceParoActual = 0;

                            return ParoService.ObtenerParosPorGerarquia($scope.IndiceParoActual, IndiceProceso)
                                .then(function (response)
                                {
                                    var Estado = response.data.Estado;
                                    if (!Estado) {
                                        var Mensaje = response.data.Mensaje;
                                        $log.info('Se produjo el siguiente error en el método ObtenerCentros = ' + Mensaje);
                                    }
                                    else {
                                        var ListaParos = response.data.ListaParos;

                                        if (ListaParos !== null && ListaParos.length > 0)
                                        {
                                            switch (Nivel)
                                            {
                                                case 1:
                                                    $scope.HabilitarFolio = false;
                                                    $scope.ListaParosSegundoNivel = null;
                                                    $scope.ListaParosTercerNivel = null;
                                                    $scope.ListaParosCuartoNivel = null;
                                                    $scope.ListaParosQuintoNivel = null;
                                                    $scope.IndiceParo.Nivel01 = null;
                                                    $scope.IndiceParo.Nivel02 = null;
                                                    $scope.IndiceParo.Nivel03 = null;
                                                    $scope.IndiceParo.Nivel04 = null;
                                                    $scope.IndiceParo.Nivel05 = null;
                                                    $scope.ListaParosPrimerNivel = ListaParos;
                                                    break;
                                                case 2:
                                                    $scope.ListaParosSegundoNivel = ListaParos;
                                                    $scope.ListaParosTercerNivel = null;
                                                    $scope.ListaParosCuartoNivel = null;
                                                    $scope.ListaParosQuintoNivel = null;
                                                    $scope.IndiceParo.Nivel02 = null;
                                                    $scope.IndiceParo.Nivel03 = null;
                                                    $scope.IndiceParo.Nivel04 = null;
                                                    $scope.IndiceParo.Nivel05 = null;
                                                    break;
                                                case 3:
                                                    $scope.ListaParosTercerNivel = ListaParos;
                                                    $scope.ListaParosCuartoNivel = null;
                                                    $scope.ListaParosQuintoNivel = null;
                                                    $scope.IndiceParo.Nivel03 = null;
                                                    $scope.IndiceParo.Nivel04 = null;
                                                    $scope.IndiceParo.Nivel05 = null;
                                                    break;
                                                case 4:
                                                    $scope.ListaParosCuartoNivel = ListaParos;
                                                    $scope.ListaParosQuintoNivel = null;
                                                    $scope.IndiceParo.Nivel04 = null;
                                                    $scope.IndiceParo.Nivel05 = null;
                                                    break;
                                                case 5:
                                                    $scope.ListaParosQuintoNivel = ListaParos;
                                                    $scope.IndiceParo.Nivel05 = null;
                                                    break;
                                            }

                                            $scope.EsUltimoNivel = false;
                                            InicializarParo();
                                        }
                                        else {
                                            $scope.EsUltimoNivel = true;
                                            $scope.Paro.Indice = $scope.IndiceParoActual;
                                        }

                                    }
                                })
                                .catch(function (response) {
                                    $log.error('Excepcion: ', response.data);
                                })
                                .finally(function () {
                                    $log.info('Método ObtenerParos() finalizado');
                                });
                        };

                        $scope.AveriaParoPadre = function ()
                        {
                            var Nombre = Enumerable.From($scope.ListaParosPrimerNivel)
                                .Where(function (col) { return col.Indice === $scope.IndiceParo.Nivel01; })
                                .Select(function (col) { return col.Nombre; })
                                .FirstOrDefault();

                            if (!Nombre)
                                return false;
                            return EsAveria(Nombre);

                        };

                        function EsAveria(Nombre) {
                            return Nombre.toLowerCase() === 'averías' || Nombre.toLowerCase() === 'averias' || Nombre.toLowerCase() === 'avería' || Nombre.toLowerCase() === 'averia';
                        }
                        
                        $scope.ParoEscogido = function (IndiceParo, Nivel)
                        {
                            $scope.IndiceParoActual = IndiceParo;
                            var SiguienteNivel = parseInt(Nivel) + 1;

                            var ListaParos = null;
                            switch (Nivel) {
                                case 1:
                                    ListaParos = $scope.ListaParosPrimerNivel;
                                    $scope.HabilitarFolio = $scope.AveriaParoPadre();
                                    break;
                                case 2:
                                    ListaParos = $scope.ListaParosSegundoNivel;
                                    break;
                                case 3:
                                    ListaParos = $scope.ListaParosTercerNivel;
                                    break;
                                case 4:
                                    ListaParos = $scope.ListaParosCuartoNivel;
                                    break;
                                case 5:
                                    ListaParos = $scope.ListaParosQuintoNivel;
                                    break;
                                default:
                                    ListaParos = [];
                            }

                            var Nombre = Enumerable.From(ListaParos)
                                .Where(function (col) { return col.Indice === IndiceParo; })
                                .OrderBy(function (col) { return col.Indice; })
                                .Select(function (col) { return col.Nombre; })
                                .FirstOrDefault();

                            $scope.ListaNombres.push(Nombre);
                                
                            $scope.ObtenerParos(SiguienteNivel);
                        };

                        $scope.AgregarParo = function () {
                            var Paro = null;

                            $scope.Paro.Nombre = $scope.ListaNombres.join(' - ');
                            $scope.Cantidad = parseInt($scope.Cantidad);
                            Paro = angular.copy($scope.Paro);
                            $mdDialog.hide(Paro);
                        };

                        $scope.ResetearTerminoBusqueda = function () {
                            $scope.TerminoBusqueda = '';
                        };

                        $scope.DesactivarSiEstaEnUso = function (IndiceParo) {
                            var Existe = Enumerable.From(ListaIndicesParosEnUso).Any(function (item) { return item === IndiceParo; });

                            return Existe;
                        };

                        $scope.Inicializar = function () {
                            $scope.TerminoBusqueda = '';
                            $scope.EsUltimoNivel = false;
                            $scope.IndiceParoActual = 0;
                            $scope.HabilitarFolio = false;

                            $scope.ListaParosPrimerNivel = null;
                            $scope.ListaParosSegundoNivel = null;
                            $scope.ListaParosTercerNivel = null;
                            $scope.ListaParosCuartoNivel = null;
                            $scope.ListaParosQuintoNivel = null;
                            
                            $scope.IndiceParo.Nivel01 = null;
                            $scope.IndiceParo.Nivel02 = null;
                            $scope.IndiceParo.Nivel03 = null;
                            $scope.IndiceParo.Nivel04 = null;
                            $scope.IndiceParo.Nivel05 = null;

                            InicializarParo();
                        };

                        function InicializarParo () {
                            $scope.Paro.Indice = null;
                            $scope.Paro.Nombre = null;
                            $scope.Paro.Cantidad = null;
                            $scope.Paro.Folio = null;
                        }

                }],
                templateUrl: '../Scripts/app/templates/AgregarParos.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                onShowing: function () {
                },
                onComplete: function () {
                },
                onRemoving: function (event, removePromise) {
                },
                fullscreen: true,
                closeTo: angular.element(document.querySelector('#btnAddParo'))
            })
            .then(function (Paro) {
                $scope.ListaParosElegidos.push(Paro);
                $scope.ListaIndicesParosEnUso.push(Paro.Indice);
                $scope.Util.SumaParos += Paro.Cantidad;
                var resta = $scope.Util.ParoSinCausaAsignada - Paro.Cantidad;
                $scope.Util.ParoSinCausaAsignada = resta >= 0 ? resta : 0;
            },
            function () { })
            .finally(function () { });
        };

        $scope.agregarRechazo = function (ev) {
            $mdDialog.show({
                locals: { IndiceProceso: $scope.DatosGenerales.IndiceProceso, ListaIndicesRechazosEnUso: $scope.ListaIndicesRechazosEnUso },
                controller: ['$scope', '$element', '$mdDialog', 'RechazoService', 'UtilFactory', 'IndiceProceso', 'ListaIndicesRechazosEnUso',
                    function ($scope, $element, $mdDialog, RechazoService, UtilFactory, IndiceProceso, ListaIndicesRechazosEnUso)
                    {
                        $scope.TerminoBusqueda = '';
                        $scope.Rechazo = { 'Indice': null, 'Nombre': null, 'Cantidad': null };

                        $element.find('input').on('keydown', function (ev) {
                            ev.stopPropagation();
                        });

                        $scope.ResetearTerminoBusqueda = function () {
                            $scope.TerminoBusqueda = '';
                        };

                        $scope.DesactivarSiEstaEnUso = function (IndiceRechazo) {
                            var Existe = Enumerable.From(ListaIndicesRechazosEnUso).Any(function (item) { return item === IndiceRechazo; });

                            return Existe;
                        };

                        $scope.ObtenerRechazos = function ()
                        {
                            return RechazoService.ObtenerRechazos(IndiceProceso)
                                .then(function (response)
                                {
                                    var Estado = response.data.Estado;
                                    if (!Estado)
                                    {
                                        var Mensaje = response.data.Mensaje;
                                        $log.info('Se produjo el siguiente error en el método ObtenerCentros = ' + Mensaje);
                                    }
                                    else
                                    {
                                        $scope.ListaRechazos = response.data.ListaRechazos;
                                        $scope.Rechazo.Indice = $scope.ListaRechazos.length === 1 ? $scope.ListaRechazos[0].Indice : null;
                                    }
                                })
                                .catch(function (response)
                                {
                                    $log.error('Excepcion: ', response.data);
                                })
                                .finally(function ()
                                {
                                    $log.info('Método ObtenerCentros() finalizado');
                                });
                        };

                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };

                        $scope.AgregarRechazo = function () {
                            var Rechazo = null;

                            $scope.Rechazo.Nombre  = Enumerable.From($scope.ListaRechazos)
                                .Where(function (x) { return x.Indice === $scope.Rechazo.Indice; })
                                .OrderBy(function (x) { return x.Indice; })
                                .Select(function (x) { return x.Nombre; })
                                .FirstOrDefault();

                            $scope.Rechazo.Cantidad = parseInt($scope.Rechazo.Cantidad);
                            Rechazo = angular.copy($scope.Rechazo);
                            $mdDialog.hide(Rechazo);
                        };

                        $scope.Inicializar = function () {
                            $scope.Rechazo.Indice = null;
                            $scope.Rechazo.Nombre = null;
                            $scope.Rechazo.Cantidad = null;
                        };
                    }],
                templateUrl: '../Scripts/app/templates/AgregarRechazos.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                onShowing: function () { },
                onComplete: function () { },
                onRemoving: function (event, removePromise) { },
                fullscreen: false,
                closeTo: angular.element(document.querySelector('#btnAddRechazo'))
            })
                .then(function (Rechazo) {
                    $scope.ListaRechazosElegidos.push(Rechazo);
                    $scope.ListaIndicesRechazosEnUso.push(Rechazo.Indice);
                    $scope.Util.SumaPiezasRechazadas += Rechazo.Cantidad;
                }, function () {
            })
            .finally(function () {
            });
        };
        
        $scope.ObtenerCentros = function ()
        {
            return CentroService.ObtenerCentros()
                .then(function (response)
                {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerCentros = ' + Mensaje);
                    }
                    else {
                        $scope.ListaCentros = response.data.ListaCentros;
                        $scope.DatosGenerales.IndiceCentro = $scope.ListaCentros.length === 1 ? $scope.ListaCentros[0].Indice : null;
                    }
                })
                .catch(function (response) {
                    $log.error('Excepcion: ', response.data);
                })
                .finally(function () {
                    $log.info('Método ObtenerCentros() finalizado');
                });
        };

        $scope.ObtenerDepartamentos = function ()
        {
            if ($scope.ListaDepartamentos)
                return;

            return DepartamentoService.ObtenerDepartamentosPorCentro($scope.DatosGenerales.IndiceCentro)
                .then(function (response)
                {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerDepartamentos = ' + Mensaje);
                    }
                    else {
                        $scope.ListaDepartamentos = response.data.ListaDepartamentos;
                        $scope.DatosGenerales.IndiceDepartamento = $scope.ListaDepartamentos.length === 1 ? $scope.ListaDepartamentos[0].Indice : null;
                    }
                })
                .catch(function (response) {
                    $log.error('Excepcion: ', response.data);
                })
                .finally(function () {
                    $log.info('Método ObtenerDepartamentos() finalizado');
                });
        };

        $scope.ObtenerLineas = function ()
        {
            if ($scope.ListaLineas)
                return;

            return LineaService.ObtenerLineasPorDepartamento($scope.DatosGenerales.IndiceDepartamento)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerLineas = ' + Mensaje);
                    }
                    else {
                        $scope.ListaLineas = response.data.ListaLineas;
                        $scope.DatosGenerales.IndiceLinea = $scope.ListaLineas.length === 1 ? $scope.ListaLineas[0].Indice : null;
                    }
                },
                function (response) {
                    $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                })
                .catch(function (response) {
                    $log.info('Excepcion: ', response);
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerLineas() finalizado');
                });
        };

        $scope.ObtenerProcesos = function ()
        {
            if ($scope.ListaProcesos)
                return;

            return ProcesoService.ObtenerProcesosPorLinea($scope.DatosGenerales.IndiceLinea)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerProcesos = ' + Mensaje);
                    }
                    else {
                        $scope.ListaProcesos = response.data.ListaProcesos;
                        $scope.DatosGenerales.IndiceProceso = $scope.ListaProcesos.length === 1 ? $scope.ListaProcesos[0].Indice : null;
                    }
                },
                function (response) {
                    $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                })
                .catch(function (response) {
                    $log.info('Excepcion: ', response);
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerProcesos() finalizado');
                });
        };
        
        $scope.BusquedaIndicadoresPeriodo = function (IndiceProceso, FechaInicial, FechaFinal)
        {
            return IndicadorService.BusquedaIndicadoresPeriodo(IndiceProceso, FechaInicial, FechaFinal)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerProcesos = ' + Mensaje);
                    }
                    else {
                        $scope.ExistenIndicadoresPeriodo = response.data.Existe;
                        
                        $log.info('Existe = ' + $scope.ExistenIndicadoresPeriodo);
                        //if ($scope.ExistenIndicadoresPeriodo) {
                        //    $scope.Util.Estado = ESTADO_PAROS.SIN_ESTADO;

                        //    $mdDialog.show(
                        //        $mdDialog.alert()
                        //            .clickOutsideToClose(false)
                        //            .title('Búsqueda de indicadores')
                        //            .textContent('Ya existe un indicador en el período que estableciste')
                        //            .ariaLabel('existencia indicadores')
                        //            .ok('Entendido'));
                        //}
                    }
                },
                    function (response) {
                        $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                    })
                .catch(function (response) {
                    $log.info('Excepcion: ', response);
                    throw response;
                })
                .finally(function () {
                    $log.info('Método BusquedaIndicadoresPeriodo() finalizado');
                });
        };

        $scope.ValidacionBotonGuardar = function () {
            var SeDesactiva = true; 

            var EstadoConParos =
                   $scope.Util.Estado === $scope.Util.Estados.CON_PAROS
                && $scope.Util.SumaParos <= $scope.Util.CalculoHorasParo
                && $scope.Util.SumaPiezasRechazadas <= $scope.DatosIndicador.Piezas;

            var EstadoSinParos =
                $scope.Util.Estado === $scope.Util.Estados.SIN_PAROS
                && $scope.Util.SumaPiezasRechazadas <= $scope.DatosIndicador.Piezas;
            
            SeDesactiva = !(EstadoConParos || EstadoSinParos);

            return SeDesactiva;
        };
        
        $scope.$watch('DatosGenerales.IndiceCentro', function (newValue, oldValue)
        {
            if (newValue)
            {
                $scope.DatosGenerales.IndiceDepartamento = null;
                $scope.DatosGenerales.IndiceLinea = null;
                $scope.DatosGenerales.IndiceProceso = null;
                $scope.DatosGenerales.IndiceVelocidad = null;

                $scope.ListaDepartamentos = null;
                $scope.ListaLineas = null;
                $scope.ListaProcesos = null;

                $scope.ObtenerDepartamentos();
            }
        });

        $scope.$watch('DatosGenerales.IndiceDepartamento', function (newValue, oldValue)
        {
            if (newValue)
            {
                $scope.DatosGenerales.IndiceLinea = null;
                $scope.DatosGenerales.IndiceProceso = null;
                $scope.DatosGenerales.IndiceVelocidad = null;
                
                $scope.ListaLineas = null;
                $scope.ListaProcesos = null;

                $scope.ObtenerLineas();
            }
        });

        $scope.$watch('DatosGenerales.IndiceLinea', function (newValue, oldValue)
        {
            if (newValue)
            {
                $scope.DatosGenerales.IndiceProceso = null;
                $scope.DatosGenerales.IndiceVelocidad = null;

                $scope.ListaProcesos = null;

                $scope.ObtenerProcesos();
            }
        });

        $scope.$watch('DatosGenerales.IndiceProceso', function (newValue, oldValue)
        {
            if (newValue)
            {
                $scope.DatosGenerales.IndiceVelocidad = null;
                $scope.ListaVelocidades = null;
            }
        });
        
        $scope.ResetearTerminoBusqueda = function () {
            $scope.TerminoBusqueda = '';
        };
        
        $scope.TransformarChipParos = function (chip) {
            return {
                Nombre: chip.Nombre,
                Cantidad: chip.Cantidad,
                Folio: chip.Folio
            };
        };

        $scope.TransformarChipRechazos = function (chip) {
            return {
                Nombre: chip.Nombre,
                Cantidad: chip.Cantidad
            };
        };

        $scope.QuitarRechazo = function (Rechazo)
        {
            var IndiceLista = UtilFactory.FiltrarArreglo($scope.ListaIndicesRechazosEnUso, function (item) { return item === Rechazo.Indice; });

            if (IndiceLista !== -1) {
                $scope.ListaIndicesRechazosEnUso.splice(IndiceLista, 1);
                $scope.Util.SumaPiezasRechazadas -= Rechazo.Cantidad;
            }
        };

        $scope.QuitarParo = function (Paro)
        {
            var IndiceLista = UtilFactory.FiltrarArreglo($scope.ListaIndicesParosEnUso, function (item) { return item === Paro.Indice; });

            if (IndiceLista !== -1) {
                $scope.ListaIndicesParosEnUso.splice(IndiceLista, 1);
                $scope.Util.SumaParos -= Paro.Cantidad;
                var CantidadParoSinCausaAsignada = $scope.Util.ParoSinCausaAsignada + Paro.Cantidad;
                $scope.Util.ParoSinCausaAsignada = CantidadParoSinCausaAsignada > $scope.Util.CalculoHorasParo ? $scope.Util.CalculoHorasParo : CantidadParoSinCausaAsignada; 
            }
        };
    }
}) ();