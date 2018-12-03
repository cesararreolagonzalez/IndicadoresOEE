namespace IndicadoresOEE.Web.Controllers
{
    using IndicadoresOEE.Common.Models;
    using System;
    using System.Web.Mvc;

    public class CuentaController : Controller
    {
        // GET: Cuenta
        public ActionResult IniciarSesion()
        {
            return View();
        }

        [HttpPost]
        public ActionResult IniciarSesion(SesionModel modelo)
        {
            int Indice = 1;
            try {  }
            catch(Exception e) { }

            return Json(new { Indice = Indice });
        }

        // GET: Registro
        public ActionResult Registro()
        {
            return View();
        }

        // GET: Registro
        public ActionResult Registro(RegistroModel modelo)
        {
            return View();
        }
    }
}