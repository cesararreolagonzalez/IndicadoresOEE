namespace IndicadoresOEE.Web.Controllers
{
    using IndicadoresOEE.Common.Models;
    using IndicadoresOEE.Domain.Business;
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;

    public class RechazoController : Controller
    {
        private readonly RechazoBusiness rechazoBusiness;

        public RechazoController()
        {
            rechazoBusiness = new RechazoBusiness();
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
        public ActionResult ObtenerRechazosPorProceso(long IndiceProceso)
        {
            string Mensaje = string.Empty;
            bool Estado = false;
            List<RechazoModel> ListaRechazos = new List<RechazoModel>();

            try
            {
                ListaRechazos = rechazoBusiness.ObtenerRechazosPorProceso(IndiceProceso);
                Estado = true;
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            object data = new { Estado, Mensaje, ListaRechazos };
            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}