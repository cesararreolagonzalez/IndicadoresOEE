(function () {
    'use strict';
    
    angular
        .module('indicadoresoeeapp')
        .controller('CapturaMasivaIndicadorController', CapturaMasivaIndicadorController);
    
    CapturaMasivaIndicadorController.$inject = ['$element', '$scope', '$sce', '$timeout', '$filter',
        '$anchorScroll', '$log', '$window', '$mdDialog', 'moment', 'ESTADO_PAROS', 'ESTADO_VALIDACION_ORDEN',
        'CentroService', 'DepartamentoService', 'LineaService', 'ProcesoService', 'VelocidadService',
        'IndicadorService', 'SAPService', 'UtilFactory', 'ModalService'];

    function CapturaMasivaIndicadorController($element, $scope, $sce, $timeout, $filter, $anchorScroll,
        $log, $window, $mdDialog, moment, ESTADO_PAROS, ESTADO_VALIDACION_ORDEN,
        CentroService, DepartamentoService, LineaService,
        ProcesoService, VelocidadService, IndicadorService, SAPService, UtilFactory, ModalService)
    {
        // #region Properties
        $scope.EsEdicion = false;
        $scope.ListaTurnoss = ['A', 'B', 'C', 'D'];
        $scope.Turnos = ['A', 'B', 'C', 'D'];
        var FechaHoy = new Date();

        $scope.DatosGenerales = {
            IndiceCentro: null,
            IndiceDepartamento: null,
            IndiceLinea: null,
            IndiceProceso: null,
            IndiceVelocidad: null,
            Orden: null,
            Lote: null,
            Material: null,
            DescripcionMaterial: null,
            Velocidad: null
        };
        $scope.DatosIndicador = {
            Turno: null,
            Ciclo: 0,
            Piezas: 0,
            Fecha: new Date(FechaHoy.getFullYear(), FechaHoy.getMonth(), FechaHoy.getDate(), 0, 0, 0),
            Hora: 0,
            Minuto: 0
        };
        $scope.Util = {
            FechaLimite: new Date(FechaHoy.getFullYear(), FechaHoy.getMonth(), FechaHoy.getDate(), 0, 0, 0),
            CalculoHoras: null,
            CalculoHorasParo: null,
            MensajeCalculoHoras: null,
            MensajeCalculoHorasParo: null,
            SumaParos: 0,
            SumaPiezasRechazadas: 0,
            ParoSinCausaAsignada: 0,
            EstadoHorasParo: false,
            EstadoValidacionOrden: 0,
            ExistenIndicadoresPeriodo: false,
            Estado: ESTADO_PAROS.SIN_ESTADO,
            Estados: ESTADO_PAROS,
            EstadoValidacion: ESTADO_VALIDACION_ORDEN.NO_VALIDADA,
            IconoEstadoValidacionOrden: '../Content/Icons/estado_sin_busqueda.svg',
            TextoEstadoValidacionOrden: '',
            EnProcesoValidacion: false
        };
        $scope.TerminoBusqueda = '';
        $scope.ListaCentros = null;
        $scope.ListaDepartamentos = null;
        $scope.ListaLineas = null;
        $scope.ListaProcesos = null;
        $scope.ListaRechazosElegidos = [];
        $scope.ListaParosElegidos = [];
        // #endregion
        // #region Asynchronous Methods
        // #endregion
        // #region Methods
        async function ObtenerListas() {
            $scope.ListaCentros = await CentroService.ObtenerCentros();
            $scope.$apply();
            $scope.ListaDepartamentos = await DepartamentoService.ObtenerDepartamentosPorCentro($scope.DatosGenerales.IndiceCentro);
            $scope.$apply();
            $scope.ListaLineas = await LineaService.ObtenerLineasPorDepartamento($scope.DatosGenerales.IndiceDepartamento);
            $scope.$apply();
            $scope.ListaProcesos = await ProcesoService.ObtenerProcesosPorLinea($scope.DatosGenerales.IndiceLinea);
            $scope.$apply();
        }

        $scope.Editar = function (ev, indice) {
            ModalService.showWait();

            $scope.EsEdicion = true;

            var Indicador = $scope.ListaIndicadoresCompletados[indice];

            $log.info(JSON.stringify(Indicador));

            $scope.DatosGenerales.IndiceCentro = Indicador.IndiceCentro;
            $scope.DatosGenerales.IndiceDepartamento = Indicador.IndiceDepartamento;
            $scope.DatosGenerales.IndiceLinea = Indicador.IndiceLinea;
            $scope.DatosGenerales.IndiceProceso = Indicador.IndiceProceso;

            ObtenerListas();
            //$scope.ObtenerCentros();

            //$timeout(function () {
            //    $scope.ObtenerDepartamentos(Indicador.IndiceCentro);
            //}, 100);

            //$timeout(function () {
            //    $scope.ObtenerLineas(Indicador.IndiceDepartamento);
            //}, 200);

            //$timeout(function () {
            //    $scope.ObtenerProcesos(Indicador.IndiceLinea);
            //}, 300);

            $timeout(function () {

                $scope.DatosGenerales.Orden = Indicador.Orden;
                $scope.DatosGenerales.Lote = Indicador.Lote;
                $scope.DatosGenerales.Material = Indicador.Material;
                $scope.DatosGenerales.DescripcionMaterial = Indicador.DescripcionMaterial;

                $scope.DatosIndicador.Turno = Indicador.Turno;
                $scope.DatosIndicador.Piezas = Indicador.Piezas;
                $scope.DatosIndicador.Ciclo = Indicador.Ciclo;

                //var fechaJS1 = moment(Indicador.Fecha);
                var Fecha = new Date(Indicador.Fecha);

                $scope.DatosIndicador.Fecha = Fecha;
                $scope.Util.FechaLimite = Fecha;

                $scope.DatosIndicador.Hora = Fecha.getHours();
                $scope.DatosIndicador.Minuto = Fecha.getMinutes();

                $scope.ListaRechazosElegidos = Indicador.ListaRechazos;
                $scope.ListaParosElegidos = Indicador.ListaParos;

                var ListaIndicesParos = Enumerable.From(Indicador.ListaParos)
                    .Select(function (col) { return col.Indice; })
                    .ToArray();

                var ListaIndicesRechazos = Enumerable.From(Indicador.ListaRechazos)
                    .Select(function (col) { return col.Indice; })
                    .ToArray();

                $scope.ListaIndicesRechazosEnUso = ListaIndicesRechazos;
                $scope.ListaIndicesParosEnUso = ListaIndicesParos;

                // Sumas de paros y rechazos

                var SumaParos = Enumerable.From(Indicador.ListaParos)
                    .Select(function (col) { return col.Cantidad; })
                    .Sum();

                var SumaParoSinCausaAsignada = Enumerable.From(Indicador.ListaParos)
                    .Where(function (col) { return col.Nombre === 'Sin causa asignada'; })
                    .Select(function (col) { return col.Cantidad; })
                    .Sum();

                var SumaRechazos = Enumerable.From(Indicador.ListaRechazos)
                    .Select(function (col) { return col.Cantidad; })
                    .Sum();

                $scope.Util.SumaPiezasRechazadas = parseInt(SumaRechazos);
                $scope.Util.SumaParos = parseInt(SumaParos);

                $scope.Util.ParoSinCausaAsignada = SumaParoSinCausaAsignada;
            }, 500);

            $timeout(function () {
                ModalService.hideWait();
            }, 1000);
        };
        $scope.Guardar = function (ev) {
            var ListaParos = angular.copy($scope.ListaParosElegidos);
            var ListaRechazos = angular.copy($scope.ListaRechazosElegidos);

            if ($scope.Util.ParoSinCausaAsignada > 0) {
                ListaParos.push({ Indice: 0, Nombre: 'Sin causa asignada', Cantidad: $scope.Util.ParoSinCausaAsignada, Folio: null });
            }

            $scope.Indicador =
                {
                    IndiceCentro: angular.copy($scope.DatosGenerales.IndiceCentro),
                    IndiceDepartamento: angular.copy($scope.DatosGenerales.IndiceDepartamento),
                    IndiceLinea: angular.copy($scope.DatosGenerales.IndiceLinea),
                    IndiceProceso: angular.copy($scope.DatosGenerales.IndiceProceso),
                    IndiceVelocidad: angular.copy($scope.DatosGenerales.IndiceVelocidad),
                    Velocidad: angular.copy($scope.DatosGenerales.Velocidad),
                    Orden: angular.copy($scope.DatosGenerales.Orden),
                    Lote: angular.copy($scope.DatosGenerales.Lote),
                    Material: angular.copy($scope.DatosGenerales.Material),
                    DescripcionMaterial: angular.copy($scope.DatosGenerales.DescripcionMaterial),
                    Piezas: angular.copy($scope.DatosIndicador.Piezas),
                    Reales: 0,
                    Ciclo: angular.copy($scope.DatosIndicador.Ciclo),
                    Turno: angular.copy($scope.DatosIndicador.Turno),
                    Fecha: angular.copy($scope.DatosIndicador.Fecha),
                    ListaParos: ListaParos,
                    ListaRechazos: ListaRechazos
                };

            $scope.ListaIndicadoresCompletados.push(angular.copy($scope.Indicador));

            // Extraer la información de las listas existentes

            var NombreCentro = Enumerable.From($scope.ListaCentros)
                .Where(function (col) { return col.Indice === $scope.DatosGenerales.IndiceCentro; })
                .OrderBy(function (col) { return col.Indice; })
                .Select(function (col) { return col.Nombre; })
                .FirstOrDefault();

            var NombreDepartamento = Enumerable.From($scope.ListaDepartamentos)
                .Where(function (col) { return col.Indice === $scope.DatosGenerales.IndiceDepartamento; })
                .OrderBy(function (col) { return col.Indice; })
                .Select(function (col) { return col.Nombre; })
                .FirstOrDefault();

            var NombreLinea = Enumerable.From($scope.ListaLineas)
                .Where(function (col) { return col.Indice === $scope.DatosGenerales.IndiceLinea; })
                .OrderBy(function (col) { return col.Indice; })
                .Select(function (col) { return col.Nombre; })
                .FirstOrDefault();

            var NombreProceso = Enumerable.From($scope.ListaProcesos)
                .Where(function (col) { return col.Indice === $scope.DatosGenerales.IndiceProceso; })
                .OrderBy(function (col) { return col.Indice; })
                .Select(function (col) { return col.Nombre; })
                .FirstOrDefault();

            var IndicadorInformacion = {
                'Icono': imagePath,
                'NombreCentro': NombreCentro,
                'NombreDepartamento': NombreDepartamento,
                'NombreLinea': NombreLinea,
                'NombreProceso': NombreProceso,
                'NumeroPiezas': $scope.DatosIndicador.Piezas,
                'Ciclo': $scope.DatosIndicador.Ciclo,
                'NumeroParos': $scope.ListaParosElegidos.length,
                'NumeroRechazos': $scope.ListaRechazosElegidos.length
            };

            $log.info(JSON.stringify(IndicadorInformacion));

            $scope.ListaInformativaCapturasIndicadores.push(IndicadorInformacion);

            $scope.ResetearDatosIndicador();
            $scope.LimpiarFormulario();

            //$log.info($scope.datosIndicadorForm.piezas);
            //$scope.datosIndicadorForm.piezas.$setDirty(false);
            //$scope.datosIndicadorForm.piezas.$setPristine();
            //$scope.datosIndicadorForm.piezas.$setUntouched();

            //$log.info($scope.datosIndicadorForm.piezas);
        };
        // #endregion
        // #region Watchs
        // #endregion


        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

        $scope.CapturaCompletada = {
            'Indice': '', 'NombreCentro': '', 'NombreDepartamento': '', 'NombreLinea': '',
            'NombreProceso': '', 'NumeroPiezas': '', 'Ciclo': '', 'NumeroParos': '', 'NumeroRechazos': ''
        };

        $scope.ListaInformativaCapturasIndicadores = [
            { "Icono": "../../Content/Numbers/Numero01.png", "NombreCentro": "PI01", "NombreDepartamento": "101", "NombreLinea": "Linea SOV", "NombreProceso": "Acondicionado", "NumeroPiezas": 1222, "Ciclo": 60, "NumeroParos": 0, "NumeroRechazos": 0 }
            ,{ "Icono": "../../Content/Numbers/Numero01.png", "NombreCentro": "PI01", "NombreDepartamento": "101", "NombreLinea": "Linea SOV", "NombreProceso": "Acondicionado", "NumeroPiezas": 1200, "Ciclo": 60, "NumeroParos": 2, "NumeroRechazos": 2 }
        ];

        $scope.ListaIndicadoresCompletados = [
            { "IndiceCentro": 6, "IndiceDepartamento": 22, "IndiceLinea": 75, "IndiceProceso": 99, "IndiceVelocidad": 12478, "Velocidad": 1620, "Orden": "1818862", "Lote": "A18D691", "Material": "4046420", "DescripcionMaterial": "AM TRAMADOL 100 MG GOTAS 10 ML NVA IMAG", "Piezas": 1222, "Reales": 0, "Ciclo": 60, "Turno": "B", "Fecha": "2018-12-18T11:00:00.388Z", "ListaParos": [{ "Indice": 0, "Nombre": "Sin causa asignada", "Cantidad": 14, "Folio": null }], "ListaRechazos": [] }
            ,{ "IndiceCentro": 6, "IndiceDepartamento": 22, "IndiceLinea": 75, "IndiceProceso": 99, "IndiceVelocidad": 12478, "Velocidad": 1620, "Orden": "1818862", "Lote": "A18D691", "Material": "4046420", "DescripcionMaterial": "AM TRAMADOL 100 MG GOTAS 10 ML NVA IMAG", "Piezas": 1200, "Reales": 0, "Ciclo": 60, "Turno": "B", "Fecha": "2018-12-18T11:00:00.151Z", "ListaParos": [{ "Indice": 70378, "Nombre": "Ajuste - AJ-LE-Codificadora PT", "Cantidad": 12, "Folio": null }, { "Indice": 70337, "Nombre": "Averías - AV-LE-Codificadora PT", "Cantidad": 1, "Folio": "00011" }, { "Indice": 0, "Nombre": "Sin causa asignada", "Cantidad": 2, "Folio": null }], "ListaRechazos": [{ "Indice": 39, "Nombre": "Caja de empaque  descuadrada", "Cantidad": 12 }, { "Indice": 40, "Nombre": "Caja plegadiza maltratada", "Cantidad": 222 }] }
        ];
        
        $scope.ObtenerListaCapturasIndicadoresPorIndice = function (IndiceInicio, Total) {
            return $filter('limitTo')($scope.ListaInformativaCapturasIndicadores, Total, IndiceInicio);
        };
        

        // Sirven para desactivar de la lista los paros escogidos
        $scope.ListaIndicesRechazosEnUso = [];
        $scope.ListaIndicesParosEnUso = [];

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
                        $scope.MostrarDialogoError('Se produjo un error al intentar obtener la lista de Centros');
                    }
                    else {
                        $scope.ListaCentros = response.data.ListaCentros;
                    }
                })
                .catch(function (response) {
                    $scope.MostrarDialogoError('Se produjo una excepción al intentar obtener la lista de Centros');
                    $log.error('Excepcion: ', response.data);
                })
                .finally(function () {
                    $log.info('Método ObtenerCentros() finalizado');
                });
        };

        $scope.ObtenerDepartamentos = function (IndiceCentro)
        {
            IndiceCentro = IndiceCentro ? IndiceCentro : $scope.DatosGenerales.IndiceCentro;
            $log.info('IndiceCentro = ' + IndiceCentro);

            return DepartamentoService.ObtenerDepartamentosPorCentro(IndiceCentro)
                .then(function (response)
                {
                    var status = response.status;
                    var statusText = response.statusText;

                    var Estado = response.data.Estado;

                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerDepartamentos = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar obtener la lista de Departamentos');
                    }
                    else {
                        $scope.ListaDepartamentos = response.data.ListaDepartamentos;
                    }
                })
                .catch(function (response) {
                    $log.error(response);
                    $scope.MostrarDialogoError('Se produjo una excepción al intentar obtener la lista de Departamentos');
                })
                .finally(function () {
                    $log.info('Método ObtenerDepartamentos() finalizado');
                });
        };

        $scope.ObtenerLineas = function (IndiceDepartamento)
        {
            IndiceDepartamento = IndiceDepartamento ? IndiceDepartamento : $scope.DatosGenerales.IndiceDepartamento;
            $log.info('IndiceDepartamento = ' + IndiceDepartamento);

            return LineaService.ObtenerLineasPorDepartamento(IndiceDepartamento)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerLineas = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar obtener la lista de Lineas');
                    }
                    else {
                        $scope.ListaLineas = response.data.ListaLineas;
                    }
                },
                function (response) {
                    $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                })
                .catch(function (response) {
                    $log.info(response);
                    $scope.MostrarDialogoError('Se produjo una excepción al intentar obtener la lista de Lineas');
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerLineas() finalizado');
                });
        };

        $scope.ObtenerProcesos = function (IndiceLinea)
        {
            IndiceLinea = IndiceLinea ? IndiceLinea : $scope.DatosGenerales.IndiceLinea;
            $log.info('IndiceLinea = ' + IndiceLinea);

            return ProcesoService.ObtenerProcesosPorLinea(IndiceLinea)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerProcesos = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar obtener la lista de Procesos');
                    }
                    else {
                        $scope.ListaProcesos = response.data.ListaProcesos;
                    }
                },
                function (response) {
                    $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                })
                .catch(function (response) {
                    $scope.MostrarDialogoError('Se produjo una excepción al intentar obtener la lista de Procesos');
                    $log.info(response);
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerProcesos() finalizado');
                });
        };

        $scope.ValidarOrden = function (ev)
        {
            if (!$scope.DatosGenerales.Orden)
                return;

            $scope.Util.EnProcesoValidacion = true;
            $scope.Util.EstiloEstadoValidacionOrden = {};
            $scope.Util.EstadoValidacion = ESTADO_VALIDACION_ORDEN.NO_VALIDADA;
            $scope.Util.TextoEstadoValidacionOrden = 'En proceso de validación';
            $scope.Util.IconoEstadoValidacionOrden = '../Content/Icons/estado_sin_busqueda.svg';
            
            return SAPService.ValidacionOrden($scope.DatosGenerales.Orden)
                .then(function (response)
                {
                    $scope.Util.EnProcesoValidacion = false;
                    var Modelo = response.data.Modelo;

                    switch (Modelo.EstatusValidacionOrden)
                    {
                        case ESTADO_VALIDACION_ORDEN.ERROR:
                            $scope.Util.EstiloEstadoValidacionOrden = {};
                            $scope.Util.EstadoValidacion = ESTADO_VALIDACION_ORDEN.NO_VALIDADA;
                            $scope.Util.TextoEstadoValidacionOrden = 'No pudo ser validado en SAP';
                            $scope.Util.IconoEstadoValidacionOrden = '../Content/Icons/estado_sin_busqueda.svg';

                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(false)
                                    .title('No se pudo validar la orden')
                                    .textContent('Hubo un problema al intentar establecer comunicación con SAP.')
                                    .ariaLabel('Excepcion')
                                    .ok('Entendido')
                                    .targetEvent(ev));
                            break;

                        case ESTADO_VALIDACION_ORDEN.VALIDA:
                            $scope.Util.EstiloEstadoValidacionOrden = { "color": "#087f23" };
                            $scope.Util.EstadoValidacion = Modelo.EstatusValidacionOrden;
                            $scope.Util.TextoEstadoValidacionOrden = 'Órden válida';
                            $scope.Util.IconoEstadoValidacionOrden = '../Content/Icons/estado_encontrado.svg';

                            $scope.DatosGenerales.Lote = Modelo.Lote;
                            $scope.DatosGenerales.Material = Modelo.Material;
                            $scope.DatosGenerales.DescripcionMaterial = Modelo.Descripcion;
                            break;

                        case ESTADO_VALIDACION_ORDEN.NO_ENCONTRADA:
                            $scope.Util.EstiloEstadoValidacionOrden = { "color": "#ba000d" };
                            $scope.Util.EstadoValidacion = Modelo.EstatusValidacionOrden;
                            $scope.Util.TextoEstadoValidacionOrden = 'Órden inválida';
                            $scope.Util.IconoEstadoValidacionOrden = '../Content/Icons/estado_no_encontrado.svg';

                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(false)
                                    .title('Orden no encontrada')
                                    .textContent('No se encontró la orden en SAP.')
                                    .ariaLabel('Excepcion')
                                    .ok('Entendido')
                                    .targetEvent(ev));

                            $scope.DatosGenerales.Lote = '';
                            $scope.DatosGenerales.Material = '';
                            $scope.DatosGenerales.DescripcionMaterial = '';
                            break;

                        default: break;
                    }
                },
                function (response) {
                    $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                })
                .catch(function (response) {
                    $log.info(response);
                    $scope.MostrarDialogoError('Se produjo una excepción al intentar validar la Orden en SAP');
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ValidarOrden() finalizado');
                });
        };

        $scope.ObtenerSumatoriaParos = function ()
        {
            var Sumatoria = Enumerable.From($scope.ListaParosElegidos)
                .Select(function (col) { return col.Cantidad; })
                .Sum();
            
            return parseInt(Sumatoria);
        };
        
        $scope.ObtenerSumatoriaParosSinCausaAsignada = function ()
        {
            var Sumatoria = Enumerable.From($scope.ListaParosElegidos)
                .Where(function (col) { return col.Nombre === 'Sin causa asignada'; })
                .Select(function (col) { return col.Cantidad; })
                .Sum();
            
            return parseInt(Sumatoria);
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
                    }
                },
                    function (response) {
                        $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                    })
                .catch(function (response) {
                    $log.info(response);
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

        // Al obtener el Proceso
        function ObtenerIndicadorPorProceso()
        {
            $log.info('ObtenerIndicadorPorProceso');
            return IndicadorService.ObtenerIndicadorPorProceso($scope.DatosGenerales.IndiceProceso)
                .then(function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerIndicadorPorProceso = ' + Mensaje);
                    }
                    else {
                        var Indicador = response.data.Indicador;
                        var Fecha = moment().year(Indicador.Año).month(Indicador.Mes - 1).date(Indicador.Dia).hour(Indicador.Hora).minute(Indicador.Minuto).second(0).toDate();

                        $scope.DatosGenerales.Orden = Indicador.Orden;
                        $scope.DatosGenerales.Lote = Indicador.Lote;
                        $scope.DatosGenerales.Material = Indicador.Material;
                        $scope.DatosGenerales.DescripcionMaterial = Indicador.DescripcionMaterial;
                        $scope.DatosGenerales.Velocidad = Indicador.Velocidad;
                        $scope.DatosGenerales.IndiceVelocidad = Indicador.IndiceVelocidad;

                        $scope.DatosIndicador.Ciclo = Indicador.Ciclo;
                        $scope.DatosIndicador.Turno = Indicador.Turno;
                        $scope.DatosIndicador.Hora = Indicador.Hora;
                        $scope.DatosIndicador.Minuto = Indicador.Minuto;

                        $scope.DatosIndicador.Fecha = angular.copy(Fecha);
                        $scope.Util.FechaLimite = angular.copy(Fecha);
                    }
                },
                    function (response) {
                        $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                    })
                .catch(function (response) {
                    $log.info(response);
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerIndicadorPorProceso() finalizado');
                });
        }

        // Al obtener el Material
        function ObtenerVelocidad(IndiceProceso, Material)
        {
            return VelocidadService.ObtenerVelocidadPorMaterial(IndiceProceso, Material)
                .then(function (response) {
                    var Estado = response.data.Estado;
                
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerVelocidad = ' + Mensaje);
                    }
                    else {
                        var Velocidad = response.data.velocidadModel;
                        $scope.DatosGenerales.Velocidad = Velocidad.Velocidad;
                        $scope.DatosGenerales.IndiceVelocidad = Velocidad.Indice;
                    }
                },
                function (response) {
                    $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                })
                .catch(function (response) {
                    $log.info(response);
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerVelocidad() finalizado');
                });
        }
        
        function ObtenerMinutosParos()
        {
            var Velocidad = angular.copy($scope.DatosGenerales.Velocidad);
            var Piezas = angular.copy($scope.DatosIndicador.Piezas);
            var Ciclo = angular.copy($scope.DatosIndicador.Ciclo);

            if (!Velocidad || !Piezas || !Ciclo)
                return;
            
            Velocidad = parseInt(Velocidad);
            Piezas = parseInt(Piezas);
            Ciclo = parseInt(Ciclo);

            var VelocidadReal = Velocidad * Ciclo / 60;
            var CalculoHoras = parseFloat(Piezas / VelocidadReal);
            var CalculoHorasParo = parseInt((1 - CalculoHoras) * Ciclo);

            $scope.Util.CalculoHoras = CalculoHoras > 0 ? CalculoHoras : 0;
            $scope.Util.CalculoHorasParo = CalculoHorasParo > 0 ? parseInt(CalculoHorasParo) : 0;

            if (!$scope.EsEdicion) 
                $scope.Util.ParoSinCausaAsignada = 0;

            if ($scope.Util.CalculoHoras < 1 && $scope.Util.CalculoHorasParo > 0)
            {
                $scope.Util.Estado = $scope.Util.Estados.CON_PAROS;

                var Mensaje = $sce.trustAsHtml('Debes capturar <b>' + CalculoHorasParo + '</b> minutos');
                $scope.Util.MensajeCalculoHoras = 'Minutos de paro';
                $scope.Util.MensajeCalculoHorasParo = Mensaje;

                $scope.SumaParos = $scope.ObtenerSumatoriaParos();
                var x = $scope.Util.SumaParos > $scope.Util.CalculoHorasParo;
                //var SumatoriaExistenteSinCausaAsignada = $scope.ObtenerSumatoriaParosSinCausaAsignada();
                //$scope.Util.ParoSinCausaAsignada = SumatoriaExistenteSinCausaAsignada > 0 ? SumatoriaExistenteSinCausaAsignada : CalculoHorasParo;
                if (!$scope.EsEdicion) 
                    $scope.Util.ParoSinCausaAsignada = CalculoHorasParo;
                $scope.Util.EstadoHorasParo = true;
            }
            else if ($scope.Util.CalculoHoras >= 0 && $scope.Util.CalculoHoras <= 1.1 && $scope.Util.CalculoHorasParo <= 0) {
                $scope.Util.Estado = $scope.Util.Estados.SIN_PAROS;

                $scope.Util.MensajeCalculoHoras = 'Minutos de paros';
                $scope.Util.MensajeCalculoHorasParo = 'No hay minutos de paros por agregar';
                $scope.Util.EstadoHorasParo = false;
            }
            else if ($scope.Util.CalculoHoras > 1.1) {
                $scope.Util.Estado = $scope.Util.Estados.ERROR;

                $scope.Util.MensajeCalculoHoras = 'Minutos de paros';
                $scope.Util.MensajeCalculoHorasParo = 'Corrige las piezas producidas';
                $scope.Util.EstadoHorasParo = false;
            }
            else {
                $scope.Util.Estado = $scope.Util.Estados.SIN_ESTADO;
            }

            $log.info('Método ObtenerMinutosParos() finalizado');
        }

        // ==============================================================================================================
        
        $scope.$watch('ListaCentros', function (newValue, oldValue) {
            if (newValue && newValue.length > 0)
            {
                if ( !$scope.EsEdicion )
                    $scope.DatosGenerales.IndiceCentro = $scope.ListaCentros.length === 1 ? $scope.ListaCentros[0].Indice : null;
            }
        });

        $scope.$watch('ListaDepartamentos', function (newValue, oldValue) {
            if (newValue && newValue.length > 0) {
                if (!$scope.EsEdicion)
                    $scope.DatosGenerales.IndiceDepartamento = $scope.ListaDepartamentos.length === 1 ? $scope.ListaDepartamentos[0].Indice : null;
            }
        });

        $scope.$watch('ListaLineas', function (newValue, oldValue) {
            if (newValue && newValue.length > 0) {
                if (!$scope.EsEdicion)
                    $scope.DatosGenerales.IndiceLinea = $scope.ListaLineas.length === 1 ? $scope.ListaLineas[0].Indice : null;
            }
        });

        $scope.$watch('ListaProcesos', function (newValue, oldValue) {
            if (newValue && newValue.length > 0) {
                if (!$scope.EsEdicion)
                    $scope.DatosGenerales.IndiceProceso = $scope.ListaProcesos.length === 1 ? $scope.ListaProcesos[0].Indice : null;
            }
        });

        $scope.$watch('DatosGenerales.IndiceCentro', function (newValue, oldValue)
        {
            if (newValue) {
                if (!$scope.EsEdicion) {
                    $scope.DatosGenerales.IndiceDepartamento = null;
                    $scope.DatosGenerales.IndiceLinea = null;
                    $scope.DatosGenerales.IndiceProceso = null;
                    $scope.DatosGenerales.Orden = null;
                    $scope.DatosGenerales.Lote = null;
                    $scope.DatosGenerales.IndiceVelocidad = null;
                    $scope.DatosGenerales.Velocidad = null;
                    $scope.DatosGenerales.Material = null;
                    $scope.DatosGenerales.DescripcionMaterial = null;
                    $scope.ResetearDatosIndicador();

                    $scope.ListaDepartamentos = null;
                    $scope.ListaLineas = null;
                    $scope.ListaProcesos = null;

                    $scope.ObtenerDepartamentos();
                }
            }
        });

        $scope.$watch('DatosGenerales.IndiceDepartamento', function (newValue, oldValue)
        {
            if (newValue)
            {
                if (!$scope.EsEdicion) {
                    $scope.DatosGenerales.IndiceLinea = null;
                    $scope.DatosGenerales.IndiceProceso = null;
                    $scope.DatosGenerales.Orden = null;
                    $scope.DatosGenerales.Lote = null;
                    $scope.DatosGenerales.IndiceVelocidad = null;
                    $scope.DatosGenerales.Velocidad = null;
                    $scope.DatosGenerales.Material = null;
                    $scope.DatosGenerales.DescripcionMaterial = null;
                    $scope.ResetearDatosIndicador();

                    $scope.ListaLineas = null;
                    $scope.ListaProcesos = null;

                    $scope.ObtenerLineas();
                }
            }
        });

        $scope.$watch('DatosGenerales.IndiceLinea', function (newValue, oldValue)
        {
            if (newValue)
            {
                if (!$scope.EsEdicion) {
                    $scope.DatosGenerales.IndiceProceso = null;
                    $scope.DatosGenerales.Orden = null;
                    $scope.DatosGenerales.Lote = null;
                    $scope.DatosGenerales.IndiceVelocidad = null;
                    $scope.DatosGenerales.Velocidad = null;
                    $scope.DatosGenerales.Material = null;
                    $scope.DatosGenerales.DescripcionMaterial = null;
                    $scope.ResetearDatosIndicador();

                    $scope.ListaProcesos = null;

                    $scope.ObtenerProcesos();
                }
            }
        });

        $scope.$watch('DatosGenerales.Orden', function (newValue, oldValue)
        {
            // TIP: Añadir una validacion negativa al front para que la caja de texto se vea roja

            if (!!newValue && newValue.length > 0 && $scope.Util.EstadoValidacion === ESTADO_VALIDACION_ORDEN.NO_VALIDADA) {
                $scope.Util.TextoEstadoValidacionOrden = 'Aún no ha sido validado en SAP';
            }
            else {
                $scope.Util.TextoEstadoValidacionOrden = '';
                $scope.Util.EstiloEstadoValidacionOrden = {};
                $scope.Util.EstadoValidacion = ESTADO_VALIDACION_ORDEN.NO_VALIDADA;
            }

        });

        $scope.$watch('DatosGenerales.IndiceProceso', function (newValue, oldValue)
        {
            if (newValue)
            {
                if (!$scope.EsEdicion) {
                    $scope.DatosGenerales.Orden = null;
                    $scope.DatosGenerales.Lote = null;
                    $scope.DatosGenerales.IndiceVelocidad = null;
                    $scope.DatosGenerales.Velocidad = null;
                    $scope.DatosGenerales.Material = null;
                    $scope.DatosGenerales.DescripcionMaterial = null;
                    $scope.ResetearDatosIndicador();

                    ObtenerIndicadorPorProceso();
                }
            }
        });

        $scope.$watch('DatosGenerales.Material', function (newValue, oldValue)
        {
            if (newValue)
            {
                $scope.DatosGenerales.IndiceVelocidad = null;
                $scope.DatosGenerales.Velocidad = null;
                
                ObtenerVelocidad($scope.DatosGenerales.IndiceProceso, newValue);
            }
        });

        $scope.$watch('DatosIndicador.Hora', function (newValue, oldValue) {
            if (!!newValue || newValue === 0 && newValue !== '') {
                $scope.DatosIndicador.Fecha.setHours(newValue);
            }
        });
        
        $scope.$watch('DatosIndicador.Minuto', function (newValue, oldValue) {
            if (!!newValue || newValue === 0 && newValue !== '') {
                $scope.DatosIndicador.Fecha.setMinutes(newValue);
            }
        });
        
        $scope.$watch('Util.Estado', function (newValue, oldValue)
        {
            if ((!!newValue || newValue === 0) && newValue !== '')
            {
                if ($scope.EsEdicion)
                    return;
                
                $scope.Util.MensajeCalculoHoras = null;
                $scope.Util.MensajeCalculoHorasParo = null;
                $scope.Util.EstadoHorasParo = false;

                $scope.Util.CalculoHoras = 0;
                $scope.Util.CalculoHorasParo = 0;
                
                $scope.MensajeCalculoHoras = null;
                $scope.MensajeCalculoHorasParo = null;
            }
        });

        $scope.$watchGroup(['DatosIndicador.Piezas', 'DatosGenerales.Velocidad', 'DatosIndicador.Ciclo'],
            function (ValoresActuales, ValoresAnteriores)
            {
                if (ValoresActuales === ValoresAnteriores)
                    return;

                var Piezas = ValoresActuales[0];
                var Velocidad = ValoresActuales[1];
                var Ciclo = ValoresActuales[2];

                // !! evalúa si es no nulo
                var EsValido = !!Piezas && !!Velocidad && !!Ciclo;
                
                if (EsValido) 
                    ObtenerMinutosParos();
                else
                    $scope.Util.Estado = ESTADO_PAROS.SIN_ESTADO;
            }
        );

        $scope.$watchGroup(['DatosGenerales.IndiceProceso', 'DatosIndicador.Fecha', 'DatosIndicador.Ciclo'],
            function (ValoresActuales, ValoresAnteriores)
            {
                if (ValoresActuales === ValoresAnteriores)
                    return;

                var IndiceProceso = ValoresActuales[0];
                var FechaInicial = ValoresActuales[1];
                var Ciclo = ValoresActuales[2];
                
                var EsValido = !!IndiceProceso && !!FechaInicial && (!!Ciclo || Ciclo > 0);

                if (EsValido)
                {
                    var FechaFinal = angular.copy(FechaInicial);
                    FechaFinal.setMinutes(FechaFinal.getMinutes() + Ciclo);

                    var FechaInicialFormateada = $filter('date')(FechaInicial, "yyyy-MM-dd HH:mm");
                    var FechaFinalFormateada = $filter('date')(FechaFinal, "yyyy-MM-dd HH:mm");

                    $scope.BusquedaIndicadoresPeriodo(IndiceProceso, FechaInicialFormateada, FechaFinalFormateada);
                }
                else
                    return;
            }
        );


        $scope.ResetearTerminoBusqueda = function () {
            $scope.TerminoBusqueda = '';
        };
        
        $scope.LimpiarFormulario = function () {
            $scope.DatosGenerales.IndiceCentro = '';
            $scope.DatosGenerales.IndiceDepartamento = '';
            $scope.DatosGenerales.IndiceLinea = '';
            $scope.DatosGenerales.IndiceProceso = '';

            $scope.DatosGenerales.Orden = null;
            $scope.DatosGenerales.Lote = null;
            $scope.DatosGenerales.Material = null;
            $scope.DatosGenerales.DescripcionMaterial = null;
            $scope.DatosGenerales.Velocidad = null;
            $scope.DatosGenerales.IndiceVelocidad = null;
        };

        $scope.ResetearDatosIndicador = function () {
            $scope.DatosIndicador.Turno = null;
            $scope.DatosIndicador.Ciclo = 0;
            $scope.DatosIndicador.Piezas = '';
            $scope.DatosIndicador.Fecha = null;
            $scope.DatosIndicador.Hora = null;
            $scope.DatosIndicador.Minuto = null;
            
            $scope.Util.MensajeCalculoHoras = null;
            $scope.Util.MensajeCalculoHorasParo = null;
            $scope.Util.SumaParos = 0;
            $scope.Util.SumaPiezasRechazadas = 0;
            $scope.Util.ParoSinCausaAsignada = 0;
            $scope.Util.CalculoHorasParo = null;
            $scope.Util.CalculoHoras = null;
            $scope.Util.FechaLimite = null;

            $scope.Util.EstadoHorasParo = false;
            $scope.Util.Estado = ESTADO_PAROS.SIN_ESTADO;
        };

        $scope.ValidarHora = function (Index) {
            if (!$scope.DatosGenerales.IndiceProceso || !$scope.DatosIndicador.Fecha)
                return;

            var Fecha1 = angular.copy($scope.DatosIndicador.Fecha);
            var Fecha2 = angular.copy($scope.Util.FechaLimite);

            var HoraLimite = $scope.Util.FechaLimite.getHours();
            var FechasIguales = Fecha1.getTime() === Fecha2.getTime();
            var LaHoraActualEsMayorQueLaEstablecida = Index > HoraLimite;
            var SeDesactiva = false;

            if (FechasIguales && LaHoraActualEsMayorQueLaEstablecida)
                SeDesactiva = true;
            else
                SeDesactiva = false;
            
            return SeDesactiva;
        };
        
        $scope.ValidarMinuto = function (Index) {
            if (!$scope.DatosGenerales.IndiceProceso || !$scope.DatosIndicador.Fecha)
                return;

            var Fecha1 = angular.copy($scope.DatosIndicador.Fecha);
            var Fecha2 = angular.copy($scope.Util.FechaLimite);

            var MinutoLimite = $scope.Util.FechaLimite.getMinutes();
            var FechasIguales = Fecha1.getTime() === Fecha2.getTime();
            var LaHoraActualEsMayorQueLaEstablecida = Index > MinutoLimite;
            var SeDesactiva = false;

            if (FechasIguales && LaHoraActualEsMayorQueLaEstablecida)
                SeDesactiva = true;
            else
                SeDesactiva = false;

            return SeDesactiva;
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

        $scope.MostrarDialogoError = function (Mensaje) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#CapturaMasivaEncapsulador')))
                    .clickOutsideToClose(false)
                    .title('Ha ocurrido un problema')
                    .textContent(Mensaje)
                    .ariaLabel('Error')
                    .ok('Aceptar')
            );
        };

        $scope.MostrarMensajeMinutosParos = function ()
        {
            var Mensaje = '';

            switch ($scope.Util.Estado) {
                case $scope.Util.Estados.CON_PAROS:
                    Mensaje = 'Existen ' + $scope.Util.CalculoHorasParo + ' minutos de paros disponibles para capturar';
                    break;
                case $scope.Util.Estados.SIN_PAROS:
                    Mensaje = 'No hay minutos de paros para agregar';
                    break;
                case $scope.Util.Estados.ERROR:
                    Mensaje = 'Corrige las piezas producidas';
                    break;
                default: break;
            }

            return Mensaje;
        };
    }
}) ();