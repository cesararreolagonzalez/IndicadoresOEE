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

        public IndicadorController()
        {
            indicadorBusiness = new IndicadorBusiness();
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
    }
}