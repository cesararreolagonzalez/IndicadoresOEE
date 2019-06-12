namespace IndicadoresOEE.Web.Controllers
{
    using IndicadoresOEE.Common.Models;
    //using IndicadoresOEE.SAP.SAP;
    using System;
    using System.Web.Mvc;

    public class SAPController : Controller
    {
        //private readonly BusinessSAP ERP;

        public SAPController()
        {
            //ERP = new BusinessSAP();
        }

        ///// <summary>
        ///// 
        ///// </summary>
        ///// <param name="Orden"></param>
        ///// <returns></returns>
        //[HttpGet]
        //public JsonResult ValidacionOrden(string Orden)
        //{
        //    string Mensaje = string.Empty;
        //    ValidacionOrdenSAPModel Modelo = null;

        //    try
        //    {
        //        Modelo = ERP.ValidacionOrden(Orden);
        //    }
        //    catch(Exception e)
        //    {
        //        Modelo.Mensaje = e.Message;
        //        Modelo.EstatusValidacionOrden = -1;
        //    }

        //    return Json(new { Mensaje, Modelo }, JsonRequestBehavior.AllowGet);
        //}
    }
}