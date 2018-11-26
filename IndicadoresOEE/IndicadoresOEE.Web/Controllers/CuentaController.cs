using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IndicadoresOEE.Web.Controllers
{
    public class CuentaController : Controller
    {
        // GET: Cuenta
        public ActionResult IniciarSesion()
        {
            return View();
        }

        // GET: Registro
        public ActionResult Registro()
        {
            return View();
        }
    }
}