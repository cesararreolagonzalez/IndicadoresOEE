namespace IndicadoresOEE.Web.Controllers
{
    using System;
    using System.Web.Mvc;
    using Common.Models;
    using IndicadoresOEE.Domain.Business;

    public class PerfilController : Controller
    {
        private PerfilBusiness perfilBusiness;
        private BitacoraBusiness bitacoraBusiness;

        public PerfilController()
        {
            perfilBusiness = new PerfilBusiness();
            bitacoraBusiness = new BitacoraBusiness();
        }

        // GET: Perfil
        public ActionResult Inicio()
        {
            return View();
        }

        [HttpGet]
        public ActionResult ObtenerPerfiles()
        {
            Response Response = null;

            try
            {
                Response = new Response
                {
                    Mensaje = perfilBusiness.ObtenerPerfiles(),
                    Estado = true
                };
            }
            catch (Exception excepcion)
            {
                Response.Mensaje = excepcion.Message;
                bitacoraBusiness.AgregarBitacora(Convert.ToInt32(Session["usuario_actual"]),
                    excepcion.ToString(),
                    HttpContext.Request.Url.LocalPath);
            }

            return Json(new { Response }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult ObtenerPerfil(int Indice)
        {
            return Json(new { });
        }

        [HttpPost]
        public ActionResult AgregarPerfil(int Indice)
        {
            return Json(new { });
        }

        [HttpPut]
        public ActionResult ActualizarPerfil(int Indice)
        {
            return Json(new { });
        }

        [HttpDelete]
        public ActionResult EliminarPerfil(int Indice)
        {
            return Json(new { });
        }
    }
}