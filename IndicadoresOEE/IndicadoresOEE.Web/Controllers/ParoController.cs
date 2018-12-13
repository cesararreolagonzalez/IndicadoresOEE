namespace IndicadoresOEE.Web.Controllers
{
    using IndicadoresOEE.Common.Models;
    using IndicadoresOEE.Domain.Business;
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;

    public class ParoController : Controller
    {
        private readonly ParoBusiness paroBusiness;

        public ParoController()
        {
            paroBusiness = new ParoBusiness();
        }

        // GET: Paro
        public ActionResult Index()
        {
            return View();
        }
        
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ObtenerParosPorGerarquia(long IndiceParo, long IndiceProceso)
        {
            string Mensaje = string.Empty;
            bool Estado = false;
            List<ParoModel> ListaParos = new List<ParoModel>();

            try
            {
                ListaParos = paroBusiness.ObtenerParosPorGerarquia(IndiceParo, IndiceProceso);
                Estado = true;
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            object data = new { Estado, Mensaje, ListaParos };
            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}