﻿namespace IndicadoresOEE.Web.Controllers
{
    using IndicadoresOEE.Common.Models;
    using IndicadoresOEE.Domain.Business;
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;

    public class ProcesoController : Controller
    {
        private readonly ProcesoBusiness procesoBusiness;

        public ProcesoController()
        {
            procesoBusiness = new ProcesoBusiness();
        }

        // GET: Proceso
        public ActionResult Inicio()
        {
            return View();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        public JsonResult ObtenerProcesosPorLinea(long IndiceLinea)
        {
            string Mensaje = string.Empty;
            bool Estado = false;
            List<ProcesoModel> ListaProcesos = new List<ProcesoModel>();

            try
            {
                long IndiceUsuario = 1;

                ListaProcesos = procesoBusiness.ObtenerProcesosPorLinea(IndiceUsuario, IndiceLinea);
                Estado = true;
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            return Json(new { Estado, Mensaje, ListaProcesos }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        public JsonResult ObtenerProcesosPorLineas(long[] IndiceLinea)
        {
            string Mensaje = string.Empty;
            bool Estado = false;
            List<ProcesoModel> ListaProcesos = new List<ProcesoModel>();

            try
            {
                long IndiceUsuario = 1;

                ListaProcesos = procesoBusiness.ObtenerProcesosPorLineas(IndiceUsuario, IndiceLinea);
                Estado = true;
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            return Json(new { Estado, Mensaje, ListaProcesos }, JsonRequestBehavior.AllowGet);
        }
    }
}