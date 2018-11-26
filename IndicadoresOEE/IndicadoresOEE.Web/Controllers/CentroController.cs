namespace IndicadoresOEE.Web.Controllers
{
    using IndicadoresOEE.Common.Models;
    using IndicadoresOEE.Domain.Business;
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;

    public class CentroController : Controller
    {
        private readonly CentroBusiness centroBusiness;

        public CentroController()
        {
            centroBusiness = new CentroBusiness();
        }

        // GET: Centro
        public ActionResult Inicio()
        {
            return View();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult ObtenerCentros()
        {
            string Mensaje = string.Empty;
            bool Estado = false;
            List<CentroModel> ListaCentros = new List<CentroModel>();

            try
            {
                long IndiceUsuario = 1;

                ListaCentros = centroBusiness.ObtenerCentros(IndiceUsuario);
                Estado = true;
            }
            catch(Exception e)
            {
                Mensaje = e.Message;
            }

            return Json(new { Estado, Mensaje, ListaCentros });
        }
    }
}