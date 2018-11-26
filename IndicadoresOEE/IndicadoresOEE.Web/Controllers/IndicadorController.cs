using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IndicadoresOEE.Web.Controllers
{
    public class IndicadorController : Controller
    {
        // GET: Indicador
        public ActionResult CapturaIndividual()
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
    }
}