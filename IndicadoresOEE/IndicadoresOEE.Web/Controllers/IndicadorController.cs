namespace IndicadoresOEE.Web.Controllers
{
    using IndicadoresOEE.Common.Models;
    using IndicadoresOEE.Domain.Business;
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;

    public class IndicadorController : Controller
    {
        private readonly IndicadorBusiness indicadorBusiness;
        private readonly IndicadorTiempoBusiness indicadorTiempoBusiness;
        private readonly ParoBusiness paroBusiness;
        private readonly RechazoBusiness rechazoBusiness;

        public IndicadorController()
        {
            indicadorBusiness = new IndicadorBusiness();
            paroBusiness = new ParoBusiness();
            rechazoBusiness = new RechazoBusiness();
            indicadorTiempoBusiness = new IndicadorTiempoBusiness();
        }

        // GET: Indicador
        public ActionResult Captura()
        {
            return View();
        }

        // GET: Indicador
        public ActionResult Captura2()
        {
            return View();
        }

        // GET: Indicador
        public ActionResult CapturaMasiva()
        {
            return View();
        }

        // GET: Indicador
        public ActionResult Reporte()
        {
            return View();
        }


        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ObtenerIndicadorPorProceso(long IndiceProceso)
        {
            string Mensaje = string.Empty;
            bool Estado = false;
            IndicadorModel Indicador = new IndicadorModel();

            try
            {
                Indicador = indicadorBusiness.ObtenerIndicadorPorProceso(IndiceProceso);
                var IndicadorTiempo = indicadorTiempoBusiness.ObtenerIndicadorTiempo(IndiceProceso);

                if(IndicadorTiempo != null)
                {
                    var UltimaFecha = IndicadorTiempo.GetValueOrDefault();
                    Indicador.Fecha = UltimaFecha;

                    Indicador.Dia = UltimaFecha.Day;
                    Indicador.Mes = UltimaFecha.Month;
                    Indicador.Año = UltimaFecha.Year;
                    Indicador.Hora = UltimaFecha.Hour;
                    Indicador.Minuto = UltimaFecha.Minute;
                }

                Estado = true;
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            object data = new { Estado, Mensaje, Indicador };
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ValidarOrden(string Orden)
        {
            string Mensaje = string.Empty;
            bool Estado = false;
            IndicadorModel Indicador = new IndicadorModel();

            try
            {
                Indicador = indicadorBusiness.ValidarOrden(Orden);
                Estado = true;
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            object data = new { Estado, Mensaje, Indicador };
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult BusquedaIndicadoresPeriodo(long IndiceProceso, string FechaInicial, string FechaFinal)
        {
            string Mensaje = string.Empty;
            bool Estado = false;
            bool Existe = false;

            try
            {
                var FechaInicialConvertida = Convert.ToDateTime(FechaInicial);
                var FechaFinalConvertida = Convert.ToDateTime(FechaFinal);

                Existe = indicadorBusiness.BusquedaIndicadoresPeriodo(IndiceProceso, FechaInicialConvertida, FechaFinalConvertida);
                Estado = true;
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            object data = new { Estado, Mensaje, Existe };
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ActionResult CrearIndicador(IndicadorModel modelo)
        {
            string Mensaje = string.Empty;
            bool Estado = false;
            long IndiceIndicador = 0;
            long IndiceUsuario = 1;

            // Crea el indicador
            try
            {
                IndiceIndicador = indicadorBusiness.CrearIndicador(modelo);

                Estado = true;
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            // Agrega los rechazos del indicador
            try
            {
                if(Estado)
                {
                    if (modelo.ListaRechazos != null && modelo.ListaRechazos.Count > 0)
                    {
                        foreach (var rechazoItem in modelo.ListaRechazos)
                        {
                            rechazoBusiness.AgregarRechazo(IndiceIndicador, rechazoItem.Indice, rechazoItem.Cantidad);
                        }
                    }

                    Estado = true;
                }
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            // Agrega los paros del indicador
            try
            {
                if (Estado)
                {
                    if (modelo.ListaParos != null && modelo.ListaParos.Count > 0)
                    {
                        foreach (var paroItem in modelo.ListaParos)
                        {
                            long IndiceParo = paroItem.Indice;
                            string NombreParo = paroItem.Nombre;
                            int Cantidad = paroItem.Cantidad;
                            string Folio = paroItem.Folio;

                            if (NombreParo.Equals("Sin causa asignada", StringComparison.InvariantCultureIgnoreCase))
                            {
                                ParoModel paroModelo = paroBusiness.BuscarParo(NombreParo);

                                if (paroModelo != null)
                                {
                                    IndiceParo = paroModelo.Indice;
                                }
                                else
                                {
                                    IndiceParo = paroBusiness.CrearParo(modelo.IndiceProceso, NombreParo, 1, null);
                                    if (IndiceParo <= 0)
                                        continue;
                                }
                            }

                            paroBusiness.AgregarParo(IndiceIndicador, IndiceParo, Cantidad, Folio);
                        }
                    }

                    Estado = true;
                }
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            // Actualizar el indicador de tiempo del proceso
            try
            {
                if (Estado)
                {
                    indicadorBusiness.ActualizarIndicadorTiempo(modelo.IndiceProceso, modelo.Fecha, modelo.Ciclo);
                    
                    Estado = true;
                }
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            // Agrega entrada a la bitácora de movimientos del indicador
            try
            {
                if (Estado)
                {
                    indicadorBusiness.AgregarEntradaMovimientoIndicador(IndiceUsuario, IndiceIndicador, 1);

                    Estado = true;
                }
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            object data = new { Estado, Mensaje, IndiceIndicador };
            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}