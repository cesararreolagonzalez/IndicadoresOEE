namespace IndicadoresOEE.Web.Controllers
{
    using IndicadoresOEE.Common.Models;
    using IndicadoresOEE.Domain.Business;
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;

    public class LineaController : Controller
    {
        private readonly LineaBusiness lineaBusiness;

        public LineaController()
        {
            lineaBusiness = new LineaBusiness();
        }

        // GET: Linea
        public ActionResult Inicio()
        {
            return View();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        public ActionResult ObtenerLineas(long IndiceDepartamento)
        {
            string Mensaje = string.Empty;
            bool Estado = false;
            List<LineaModel> ListaLineas = new List<LineaModel>();

            try
            {
                long IndiceUsuario = 1;

                ListaLineas = lineaBusiness.ObtenerLineas(IndiceUsuario, IndiceDepartamento);
                Estado = true;
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            return Json(new { Estado, Mensaje, ListaLineas }, JsonRequestBehavior.AllowGet);
        }
    }
}