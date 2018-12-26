namespace IndicadoresOEE.Web.Controllers
{
    using IndicadoresOEE.Common.Models;
    using IndicadoresOEE.Domain.Business;
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;

    public class DepartamentoController : Controller
    {
        private readonly DepartamentoBusiness departamentoBusiness;

        public DepartamentoController()
        {
            departamentoBusiness = new DepartamentoBusiness();
        }

        // GET: Departamento
        public ActionResult Inicio()
        {
            return View();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        public ActionResult ObtenerDepartamentosPorCentro(long IndiceCentro)
        {
            string Mensaje = string.Empty;
            bool Estado = false;
            List<DepartamentoModel> ListaDepartamentos = new List<DepartamentoModel>();

            try
            {
                long IndiceUsuario = 1;

                ListaDepartamentos = departamentoBusiness.ObtenerDepartamentosPorCentro(IndiceUsuario, IndiceCentro);
                Estado = true;
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            return Json(new { Estado, Mensaje, ListaDepartamentos }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        public ActionResult ObtenerDepartamentosPorCentros(long[] IndiceCentro)
        {
            string Mensaje = string.Empty;
            bool Estado = false;
            List<DepartamentoModel> ListaDepartamentos = new List<DepartamentoModel>();

            try
            {
                long IndiceUsuario = 1;

                ListaDepartamentos = departamentoBusiness.ObtenerDepartamentosPorCentros(IndiceUsuario, IndiceCentro);
                Estado = true;
            }
            catch (Exception e)
            {
                Mensaje = e.Message;
            }

            return Json(new { Estado, Mensaje, ListaDepartamentos }, JsonRequestBehavior.AllowGet);
        }
    }
}