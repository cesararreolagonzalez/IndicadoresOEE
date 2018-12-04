namespace IndicadoresOEE.Web.Controllers
{
    using System.Web.Mvc;

    public class SAPController : Controller
    {
        // GET: SAP
        [HttpGet]
        public JsonResult ValidarOrden(string Orden)
        {
            return Json(new { }, JsonRequestBehavior.AllowGet);
        }
    }
}