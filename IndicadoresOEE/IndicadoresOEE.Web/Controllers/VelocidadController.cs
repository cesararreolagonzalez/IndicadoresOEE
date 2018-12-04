namespace IndicadoresOEE.Web.Controllers
{
    using IndicadoresOEE.Common.Models;
    using IndicadoresOEE.Domain.Business;
    using System;
    using System.Web.Mvc;

    public class VelocidadController : Controller
    {
        private readonly VelocidadBusiness velocidadBusiness;

        public VelocidadController()
        {
            velocidadBusiness = new VelocidadBusiness();
        }

        // GET: Velocidad
        public ActionResult Inicio()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ObtenerVelocidad(long IndiceProceso, long Material)
        {
            string Mensaje = string.Empty;
            bool Estado = false;
            VelocidadModel velocidadModel = null;

            try
            {
                velocidadModel = velocidadBusiness.ObtenerVelocidad(IndiceProceso, Material);

                if (velocidadModel != null)
                    Estado = true;
                else
                    Mensaje = "El material " + Material + " no tiene asociada ninguna velocidad";
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            return Json(new { Mensaje, Estado, velocidadModel }, JsonRequestBehavior.AllowGet);
        }
    }
}