namespace IndicadoresOEE.Web.Controllers
{
    using System;
    using System.Web.Mvc;
    using IndicadoresOEE.Domain.Business;
    using IndicadoresOEE.Common.Models;

    public class UsuarioController : Controller
    {
        private readonly BitacoraBusiness bitacoraBusiness;
        private readonly UsuarioBusiness usuarioBusiness;

        public UsuarioController()
        {
            usuarioBusiness = new UsuarioBusiness();
            bitacoraBusiness = new BitacoraBusiness();
        }

        // GET: Usuarios
        public ActionResult Inicio()
        {
            return View();
        }


        [HttpGet]
        public ActionResult ObtenerUsuarios()
        {
            Response Response = null;

            try
            {
                Response = new Response
                {
                    Mensaje = usuarioBusiness.ObtenerUsuarios(),
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
        public ActionResult ObtenerUsuario(long Indice)
        {
            return Json(new { });
        }

        [HttpPost]
        public ActionResult AgregarUsuario(long Indice)
        {
            return Json(new { });
        }

        [HttpPost]
        public ActionResult ActualizarUsuario(long Indice)
        {
            return Json(new { });
        }

        [HttpPost]
        public ActionResult EliminarUsuario(int Indice)
        {
            Response Response = null;
            
            try
            {
                Response = new Response
                {
                    Mensaje = usuarioBusiness.EliminarUsuario(Indice),
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

            //return Json(new { Response }, JsonRequestBehavior.AllowGet);

            return Json(new { Response });
        }
    }
}