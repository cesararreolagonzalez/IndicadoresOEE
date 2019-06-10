(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .controller('IndicadorTiempoController', IndicadorTiempoController);

    IndicadorTiempoController.$inject = ['$scope', '$timeout', '$log', '$mdDialog', 'ModalService', 'CentroService', 'DepartamentoService', 'LineaService', 'ProcesoService', 'IndicadorTiempoService'];

    function IndicadorTiempoController($scope, $timeout, $log, $mdDialog, ModalService, CentroService, DepartamentoService, LineaService, ProcesoService, IndicadorTiempoService) {
        //if (navigator.userAg < ent.search("NET") >= 0) {
        //    alert("NET");
        //    //code goes here
        //}

        // #region JavaScript's Methods
        $('.md-datepicker-input').prop('readonly', true);
        // #endregion
        // #region Attributes
        $scope.Tiempo = {
            IndicadorTiempoAnterior: null,
            IndicadorTiempoActual: null,
            FechaLimite: null,
            Hora: null,
            Minuto: null
        };
        $scope.Parametros =
            {
                IndiceCentro: null,
                IndiceDepartamento: null,
                IndiceLinea: null,
                IndiceProceso: null,
                IndiceVelocidad: null,
                IndiceMotivo: null
            };
        $scope.ListaParosMotivo = [
            { Nombre: 'Mantenimiento Planeado', EstaDeshabiltiado: false },
            { Nombre: 'Validaciones', EstaDeshabiltiado: false },
            { Nombre: 'Fin de semana', EstaDeshabiltiado: false },
            { Nombre: 'Fin de programa', EstaDeshabiltiado: false },
            { Nombre: 'Día Festivo', EstaDeshabiltiado: false },
            { Nombre: 'RTN', EstaDeshabiltiado: false },
            { Nombre: 'Transferencias', EstaDeshabiltiado: false },
            { Nombre: 'Envases Simulados', EstaDeshabiltiado: false },
            { Nombre: 'Habilitación', EstaDeshabiltiado: false },
            { Nombre: 'Espera de resultados de envase simulado', EstaDeshabiltiado: false },
            { Nombre: 'Sin turno programado', EstaDeshabiltiado: false }
        ];
        $scope.ListaLineas = null;
        $scope.ListaCentros = null;
        $scope.ListaProcesos = null;
        $scope.ListaVelocidades = null;
        $scope.ListaDepartamentos = null;
        // #endregion
        // #region Async Methods
        $scope.ObtenerCentros = async function () {
            return CentroService.ObtenerCentros()
                .then(async function (response) {
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
        $scope.ObtenerDepartamentos = async function () {
            if ($scope.ListaDepartamentos)
                return;

            return DepartamentoService.ObtenerDepartamentosPorCentro($scope.Parametros.IndiceCentro)
                .then(async function (response) {
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
        $scope.ObtenerLineas = async function () {
            return LineaService.ObtenerLineasPorDepartamento($scope.Parametros.IndiceDepartamento)
                .then(async function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerLineas = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar obtener la lista de Lineas');
                    }
                    else {
                        var ListaLineas = response.data.ListaLineas;
                        $scope.ListaLineas = ListaLineas;
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
        $scope.ObtenerProcesos = async function () {
            return ProcesoService.ObtenerProcesosPorLinea($scope.Parametros.IndiceLinea)
                .then(async function (response) {
                    var Estado = response.data.Estado;
                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerProcesos = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar obtener la lista de Procesos');
                    }
                    else {
                        var ListaProcesos = response.data.ListaProcesos;
                        $scope.ListaProcesos = ListaProcesos;
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
        $scope.ObtenerUltimoIndicadorTiempo = async function () {
            return IndicadorTiempoService.ObtenerUltimoIndicadorTiempo($scope.Parametros.IndiceProceso)
                .then(async function (response) {
                    var Estado = response.data.Estado;

                    if (!Estado) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ObtenerUltimoIndicadorTiempo() = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar obtener el último indicador de tiempo');
                    }
                    else {
                        var Fecha = new Date(response.data.Fecha);
                        ActualizarFecha(angular.copy(Fecha));

                        $scope.Tiempo.IndicadorTiempoAnterior = angular.copy(Fecha);

                        var FechaLimite = ValidarFechaFinSemana(Fecha);

                        if (!FechaLimite) {
                            $scope.Tiempo.FechaLimite = angular.copy(Fecha);
                            // Se busca el paro motivo "Fin de semana".
                            var indice = -1;
                            $scope.ListaParosMotivo.some(function (obj, i) {
                                return obj.Nombre === "Fin de semana" ? indice = i : false;
                            });

                            // Si el indice es mayor a -1, se deshabilita "Fin de semana".
                            if (indice > -1) {
                                $scope.ListaParosMotivo[indice].EstaDeshabiltiado = true;
                            }
                        }
                        else {
                            $scope.Tiempo.FechaLimite = angular.copy(FechaLimite);
                        }
                    }
                },
                    function (response) {
                        $log.info('Hubo un error: Estatus = ' + response.status + ', Error = ' + response.data);
                    })
                .catch(function (response) {
                    $scope.MostrarDialogoError('Se produjo una excepción al intentar obtener el último indicador de tiempo');
                    $log.info(response);
                    throw response;
                })
                .finally(function () {
                    $log.info('Método ObtenerUltimoIndicadorTiempo() finalizado');
                });
        };
        $scope.ActualizarIndicadorTiempo = function () {
            var Model = {
                'IndiceProceso': $scope.Parametros.IndiceProceso,
                'IndiceMotivo': $scope.Parametros.IndiceMotivo,
                'FechaActual': $scope.Tiempo.IndicadorTiempoAnterior.toISOString(),
                'FechaActualizada': $scope.Tiempo.IndicadorTiempoActual.toISOString()
            };
            $log.info(Model);
            $log.info($scope.Tiempo);

            ModalService.showWait();
            return IndicadorTiempoService.ActualizarIndicadorTiempo($scope.Parametros.IndiceProceso, Model)
                .then(function (response) {
                    var GuardadoExitoso = response.data.GuardadoExitoso;

                    if (!GuardadoExitoso) {
                        var Mensaje = response.data.Mensaje;
                        $log.info('Se produjo el siguiente error en el método ActualizarIndicadorTiempo() = ' + Mensaje);
                        $scope.MostrarDialogoError('Se produjo un error al intentar actualizar el indicador de tiempo');
                    }
                    else {
                        ModalService.hideWait();
                        $scope.InicializarFormulario();

                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.querySelector('body')))
                                .clickOutsideToClose(false)
                                .title('¡Indicador de tiempo actualizado!')
                                .textContent('Se actualizó el indicador de tiempo del proceso')
                                .ariaLabel('Guardado')
                                .ok('Aceptar'));


                    }
                })
                .catch(function (response) {
                    ModalService.hideWait();
                    $log.error('Excepcion: ', response.data);
                    $log.error(response);
                })
                .finally(function () {
                    $log.info('Método ActualizarIndicadorTiempo() finalizado');
                });
        };
        // #endregion
        // #region Local Methods
        $scope.MostrarDialogoError = function (Mensaje) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('body')))
                    .clickOutsideToClose(false)
                    .title('Ha ocurrido un problema')
                    .textContent(Mensaje)
                    .ariaLabel('Error')
                    .ok('Aceptar')
            );
        };
        $scope.ValidarHora = function (Hora) {
            if (!$scope.Tiempo.IndicadorTiempoAnterior)
                return;
            var FechaAnterior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);
            var FechaActualizada = angular.copy($scope.Tiempo.IndicadorTiempoActual);
            var FechaLimite = angular.copy($scope.Tiempo.FechaLimite);
            var HoraLimiteAnterior = FechaAnterior.getHours();
            var HoraLimiteFinal = FechaLimite.getHours();

            var FechaAnteriorSinHoras = new Date(FechaAnterior.getFullYear(), FechaAnterior.getMonth(), FechaAnterior.getDate());
            var FechaActualizadaSinHoras = new Date(FechaActualizada.getFullYear(), FechaActualizada.getMonth(), FechaActualizada.getDate());
            var FechaLimiteSinHoras = new Date(FechaLimite.getFullYear(), FechaLimite.getMonth(), FechaLimite.getDate());

            // Si la fecha actual es igual a la fecha límite
            if (FechaLimiteSinHoras.getTime() === FechaActualizadaSinHoras.getTime() && Hora > HoraLimiteFinal)
                return true;

            if (FechaAnteriorSinHoras.getTime() < FechaActualizadaSinHoras.getTime())
                return false;

            if (HoraLimiteAnterior > Hora)
                return true;
            return false;
        };
        $scope.ValidarMinuto = function (Minuto) {
            if (!$scope.Tiempo.IndicadorTiempoAnterior)
                return;
            var FechaAnterior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);
            var FechaActualizada = angular.copy($scope.Tiempo.IndicadorTiempoActual);
            var FechaLimite = angular.copy($scope.Tiempo.FechaLimite);

            var HoraLimiteAnterior = FechaAnterior.getHours();
            var HoraActual = FechaActualizada.getHours();

            var MinutoLimite = FechaAnterior.getMinutes();
            var MinutoLimiteFinal = FechaLimite.getHours();

            var FechaAnteriorSinHoras = new Date(FechaAnterior.getFullYear(), FechaAnterior.getMonth(), FechaAnterior.getDate());
            var FechaActualizadaSinHoras = new Date(FechaActualizada.getFullYear(), FechaActualizada.getMonth(), FechaActualizada.getDate());
            var FechaLimiteSinHoras = new Date(FechaLimite.getFullYear(), FechaLimite.getMonth(), FechaLimite.getDate());

            // Si la fecha actual es igual a la fecha límite
            if (FechaActualizadaSinHoras.getTime() === FechaLimiteSinHoras.getTime()
                && Minuto > MinutoLimiteFinal) {
                //$log.info('Caso #1');
                return true;
            }

            // Si la fecha actual es igual a la fecha mínima
            if (FechaActualizadaSinHoras.getTime() === FechaAnteriorSinHoras.getTime()
                && HoraActual === HoraLimiteAnterior
                && Minuto < MinutoLimite) {
                //$log.info('Caso #2');
                return true;
            }

            if (FechaActualizadaSinHoras.getTime() === FechaAnteriorSinHoras.getTime()
                && HoraActual > HoraLimiteAnterior) {
                //$log.info('Caso #3');
                return false;
            }

            // Si la fecha nueva es mayor que la fecha minima, todos los minutos se habilitan
            if (FechaActualizadaSinHoras.getTime() > FechaAnteriorSinHoras.getTime()) {
                //$log.info('Caso #4');
                return false;
            }

            // Si el minuto actual es mayor que el minuto minimo, y sus horas son iguales
            //    45              55             20             20
            if (MinutoLimiteFinal > Minuto & HoraLimiteAnterior === HoraActual) {
                //$log.info('Caso #5');
                return true;
            }

            //$log.info('Caso #6');
            return false;
        };
        $scope.ActualizarTiempo = function () {
            ActualizarHoras();
            ActualizarMinutos();
        };
        $scope.InicializarFormulario = function () {
            $scope.Parametros.IndiceCentro = null;
            $scope.Parametros.IndiceDepartamento = null;
            $scope.Parametros.IndiceLinea = null;
            $scope.Parametros.IndiceProceso = null;
            $scope.Parametros.IndiceMotivo = null;

            $scope.Tiempo.IndicadorTiempoAnterior = null;
            $scope.Tiempo.IndicadorTiempoActual = null;
            $scope.Tiempo.FechaLimite = null;
            $scope.Tiempo.Hora = null;
            $scope.Tiempo.Minuto = null;

            var indice = -1;
            $scope.ListaParosMotivo.some(function (obj, i) {
                return obj.Nombre === "Fin de semana" ? indice = i : false;
            });

            // Si el indice es mayor a -1, se deshabilita "Fin de semana".
            if (indice > -1) {
                $scope.ListaParosMotivo[indice].EstaDeshabiltiado = false;
            }
        }
        function ActualizarMinutos(Hora) {
            var FechaAnterior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);
            var FechaActualizada = angular.copy($scope.Tiempo.IndicadorTiempoActual);
            var FechaAnteriorSinHoras = new Date(FechaAnterior.getFullYear(), FechaAnterior.getMonth(), FechaAnterior.getDate());
            var FechaActualizadaSinHoras = new Date(FechaActualizada.getFullYear(), FechaActualizada.getMonth(), FechaActualizada.getDate());

            var HoraLimite = FechaAnterior.getHours();
            //var HoraActual = FechaActualizada.getHours();

            var MinutoLimite = FechaAnterior.getMinutes();
            //var MinutoActual = FechaActualizada.getMinutes();

            if (Hora === HoraLimite && FechaAnteriorSinHoras.getTime() === FechaActualizadaSinHoras.getTime()) {
                $scope.Tiempo.Minuto = MinutoLimite;
                $scope.Tiempo.IndicadorTiempoActual.setMinutes(MinutoLimite);
            }
            else {
                $scope.Tiempo.Minuto = 0;
                $scope.Tiempo.IndicadorTiempoActual.setMinutes(0);
            }
        }
        function ActualizarHoras() {
            var FechaAnterior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);
            var FechaActualizada = angular.copy($scope.Tiempo.IndicadorTiempoActual);
            var FechaAnteriorSinHoras = new Date(FechaAnterior.getFullYear(), FechaAnterior.getMonth(), FechaAnterior.getDate());
            var FechaActualizadaSinHoras = new Date(FechaActualizada.getFullYear(), FechaActualizada.getMonth(), FechaActualizada.getDate());

            var HoraLimite = FechaAnterior.getHours();
            var HoraActual = FechaActualizada.getHours();

            if (FechaAnteriorSinHoras.getTime() === FechaActualizadaSinHoras.getTime()) {
                $scope.Tiempo.Hora = HoraLimite;
                $scope.Tiempo.IndicadorTiempoActual.setHours(HoraLimite);
            }
            else {
                $scope.Tiempo.Hora = 0;
                $scope.Tiempo.IndicadorTiempoActual.setHours(0);
            }
        }
        function InicializarParametroFechas() {
            $scope.Tiempo.IndicadorTiempoAnterior = null;
            $scope.Tiempo.IndicadorTiempoActual = null;
            $scope.Tiempo.FechaLimite = null;
            $scope.Tiempo.Hora = null;
            $scope.Tiempo.Minuto = null;
        }
        /**
         * @desc Actualiza la fecha límite ($scope.Tiempo.FechaLimite) de acuerdo al tipo de motivo escogido.
         * @param {string} IndiceMotivo El nombre del paro "motivo" escogido.
         */
        function ValidarMotivo(IndiceMotivo) {
            var FechaLimiteInferior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);
            $scope.Tiempo.FechaLimite = null;

            ActualizarFecha(angular.copy(FechaLimiteInferior));

            switch (IndiceMotivo) {
                case 'Fin de semana':
                    // Ya está definido en el método ValidarFechaFinSemana()
                    FechaLimiteInferior = ValidarFechaFinSemana(FechaLimiteInferior);
                    break;
                case 'Día Festivo':
                    FechaLimiteInferior.setDate(FechaLimiteInferior.getDate() + 1);
                    break;
                default:
                    FechaLimiteInferior.setDate(FechaLimiteInferior.getDate() + 7);
                    break;
            }

            $scope.Tiempo.FechaLimite = FechaLimiteInferior;
        }
        /**
         * @desc Valida si la fecha es viernes, sábado o domingo.
         * @param {Date} Fecha La fecha a validar.
         * @returns {Date} La fecha máxima de acuerdo al día que se validó
         */
        function ValidarFechaFinSemana(Fecha) {
            var FechaLimite = null;
            //$log.error('Entró = ' + $scope.Tiempo.FechaLimite);
            $log.error('Entró = ' + Fecha);
            var FechaActual = angular.copy(Fecha);
            var FechaDiaSiguiente = angular.copy(Fecha);
            FechaDiaSiguiente.setDate(FechaDiaSiguiente.getDate() + 1);

            var DiaActual = FechaActual.getDay();
            var DiaSiguiente = FechaDiaSiguiente.getDay();

            if (DiaActual === 5 && DiaSiguiente === 6) { // Si el día actual es viernes
                FechaLimite = new Date(FechaActual.getFullYear(), FechaActual.getMonth(), FechaActual.getDate(), '00', '00', '00');
                FechaLimite.setDate(FechaLimite.getDate() + 3);
                //$scope.Tiempo.FechaLimite = FechaLimite;
            }
            else if (DiaActual === 6 && DiaSiguiente === 0) { // Si el día actual es sábado
                FechaLimite = new Date(FechaActual.getFullYear(), FechaActual.getMonth(), FechaActual.getDate(), '00', '00', '00');
                FechaLimite.setDate(FechaLimite.getDate() + 2);
                //$scope.Tiempo.FechaLimite = FechaLimite;
            }
            else if (DiaActual === 0 && DiaSiguiente === 1) { // Si el día actual es domingo
                FechaLimite = new Date(FechaActual.getFullYear(), FechaActual.getMonth(), FechaActual.getDate(), '00', '00', '00');
                FechaLimite.setDate(FechaLimite.getDate() + 1);
                //$scope.Tiempo.FechaLimite = FechaLimite;
            }

            //$log.error('Salió = ' + $scope.Tiempo.FechaLimite);
            return FechaLimite;
        }
        function ActualizarFecha(Fecha) {
            $scope.Tiempo.IndicadorTiempoActual = angular.copy(Fecha);
            $scope.Tiempo.Hora = angular.copy(Fecha.getHours());
            $scope.Tiempo.Minuto = angular.copy(Fecha.getMinutes());
        }
        // #endregion
        // #region Watchs
        $scope.$watch('Parametros.IndiceCentro', function (newValue, oldValue) {
            if (newValue) {
                $scope.Parametros.IndiceDepartamento = null;
                $scope.Parametros.IndiceLinea = null;
                $scope.Parametros.IndiceProceso = null;
                $scope.Parametros.IndiceMotivo = null;
                InicializarParametroFechas();

                $scope.ListaDepartamentos = null;
            }
        });
        $scope.$watch('Parametros.IndiceDepartamento', function (newValue, oldValue) {
            if (newValue) {
                $scope.Parametros.IndiceLinea = null;
                $scope.Parametros.IndiceProceso = null;
                $scope.Parametros.IndiceMotivo = null;
                InicializarParametroFechas();

                $scope.ListaLineas = null;
            }
        });
        $scope.$watch('Parametros.IndiceLinea', function (newValue, oldValue) {
            if (newValue) {
                $scope.Parametros.IndiceProceso = null;
                $scope.Parametros.IndiceMotivo = null;
                InicializarParametroFechas();

                $scope.ListaProcesos = null;
            }
        });
        $scope.$watch('Parametros.IndiceProceso', async function (newValue, oldValue) {
            if (newValue) {
                $scope.Parametros.IndiceMotivo = null;
                InicializarParametroFechas();
                //$("#motivoContenedor").fadeIn(2000, function () {
                //    // Animation complete.
                //});

                //await ObtenerUltimoIndicadorTiempo();

                $("#tiempoContenedor").fadeIn(1000, function () {
                    // Animation complete.
                });
            }
        });
        $scope.$watch('Parametros.IndiceMotivo', function (newValue, oldValue) {
            if (newValue) {
                //$scope.Tiempo.IndicadorTiempoActual = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);

                //if (newValue === 'Fin de semana') {
                //    $scope.Tiempo.Hora = 23;
                //    $scope.Tiempo.Minuto = 59;
                //}
                //else
                //{
                //    var FechaAnterior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);
                //    var FechaActualizada = angular.copy($scope.Tiempo.IndicadorTiempoActual);
                //    var FechaAnteriorSinHoras = new Date(FechaAnterior.getFullYear(), FechaAnterior.getMonth(), FechaAnterior.getDate());
                //    var FechaActualizadaSinHoras = new Date(FechaActualizada.getFullYear(), FechaActualizada.getMonth(), FechaActualizada.getDate());

                //    if (FechaAnteriorSinHoras.getTime() === FechaActualizadaSinHoras.getTime()) {
                //        $scope.Tiempo.Hora = angular.copy($scope.Tiempo.IndicadorTiempoAnterior.getHours());
                //        $scope.Tiempo.Minuto = angular.copy($scope.Tiempo.IndicadorTiempoAnterior.getMinutes());
                //    }
                //    else {
                //        $scope.Tiempo.Hora = 0;
                //        $scope.Tiempo.Minuto = 0;
                //    }
                //}

                ValidarMotivo(newValue);
            }
        });
        $scope.$watch('Tiempo.IndicadorTiempoActual', function (newValue, oldValue) {
            if (newValue) {
                //var FechaAnterior = angular.copy($scope.Tiempo.IndicadorTiempoAnterior);
                //var FechaActualizada = angular.copy(newValue);
                //var FechaAnteriorSinHoras = new Date(FechaAnterior.getFullYear(), FechaAnterior.getMonth(), FechaAnterior.getDate());
                //var FechaActualizadaSinHoras = new Date(FechaActualizada.getFullYear(), FechaActualizada.getMonth(), FechaActualizada.getDate());

                //if (FechaAnteriorSinHoras.getTime() === FechaActualizadaSinHoras.getTime()) {
                //    $scope.Tiempo.Hora = angular.copy(FechaAnterior.getHours());
                //    $scope.Tiempo.Minuto = angular.copy(FechaAnterior.getMinutes());
                //}
                //else {
                //    $scope.Tiempo.Hora = 0;
                //    $scope.Tiempo.Minuto = 0;
                //}
                ////if ($scope.Parametros.IndiceMotivo === 'Fin de semana') {
                ////    $scope.Tiempo.Hora = 23;
                ////    $scope.Tiempo.Minuto = 59;
                ////}
            }
        });
        $scope.$watch('Tiempo.Hora', function (newValue, oldValue) {
            if (newValue) {
                $scope.Tiempo.IndicadorTiempoActual.setHours(newValue);
                ActualizarMinutos(newValue);
            }
        });
        $scope.$watch('Tiempo.Minuto', function (newValue, oldValue) {
            if (newValue) {
                $log.info('Tiempo.Minuto: ' + $scope.Tiempo.IndicadorTiempoActual);
                $scope.Tiempo.IndicadorTiempoActual.setMinutes(newValue);
            }
        });
        $scope.$watch('ListaCentros', async function (newValue, oldValue) {
            if (newValue) {
                if (!newValue)
                    return;

                var ListaCentros = newValue;

                $scope.Parametros.IndiceCentro =
                    ListaCentros.length === 1 ? ListaCentros[0].Indice : null;

                if (ListaCentros.length === 1) {
                    await $scope.ObtenerDepartamentos();
                }

            }
        });
        $scope.$watch('ListaDepartamentos', async function (newValue, oldValue) {
            if (newValue) {
                if (!newValue)
                    return;

                var ListaDepartamentos = newValue;

                $scope.Parametros.IndiceDepartamento =
                    ListaDepartamentos.length === 1 ? ListaDepartamentos[0].Indice : null;

                if (ListaDepartamentos.length === 1) {
                    await $scope.ObtenerLineas();
                }

            }
        });
        $scope.$watch('ListaLineas', async function (newValue, oldValue) {
            if (newValue) {
                if (!newValue)
                    return;

                var ListaLineas = newValue;

                $scope.Parametros.IndiceLinea =
                    ListaLineas.length === 1 ? ListaLineas[0].Indice : null;

                if (ListaLineas.length === 1) {
                    await $scope.ObtenerProcesos();
                }
            }
        });
        $scope.$watch('ListaProcesos', async function (newValue, oldValue) {
            if (newValue) {
                if (!newValue)
                    return;

                var ListaProcesos = newValue;

                $scope.Parametros.IndiceProceso =
                    ListaProcesos.length === 1 ? ListaProcesos[0].Indice : null;

                if (ListaProcesos.length === 1) {
                    await $scope.ObtenerUltimoIndicadorTiempo();
                }
            }
        });
        // #endregion
    }
})();