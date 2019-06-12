namespace IndicadoresOEE.SAP.SAP
{
    using ERPConnect;
    using IndicadoresOEE.Common.Models;
    using IndicadoresOEE.Common.Util;
    using System;
    using System.Configuration;

    public class BusinessSAP
    {
        private readonly R3Connection ConectorSAP;

        public BusinessSAP()
        {
            string User = ConfigurationManager.AppSettings["User"].ToString();
            string AppServerHost = ConfigurationManager.AppSettings["AppServerHost"].ToString();
            int SystemNumber = Convert.ToInt32(ConfigurationManager.AppSettings["SystemNumber"].ToString());
            string Password = Encriptador.Desencriptar(ConfigurationManager.AppSettings["Password"].ToString(), true);
            string Client = ConfigurationManager.AppSettings["Client"].ToString();
            string Language = ConfigurationManager.AppSettings["Language"].ToString();
            string Licencia = ConfigurationManager.AppSettings["Licencia"].ToString();

            LIC.SetLic(Licencia);

            ConectorSAP = new R3Connection(AppServerHost, SystemNumber, User, Password, Language, Client);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Orden"></param>
        public ValidacionOrdenSAPModel ValidacionOrden(string Orden)
        {
            ValidacionOrdenSAPModel Modelo = new ValidacionOrdenSAPModel();

            try
            {
                ConectorSAP.Open();

                RFCFunction FuncionSAP = ConectorSAP.CreateFunction("ZFM_OEE_GET_ORDEN");
                
                FuncionSAP.Exports["IM_AUFNR"].ParamValue = "00000" + Orden;

                FuncionSAP.Execute();

                Modelo.Material = FuncionSAP.Imports["EX_MATNR"]?.ParamValue?.ToString().Trim();
                Modelo.Descripcion = FuncionSAP.Imports["EX_MAKTX"]?.ParamValue?.ToString().TrimStart().TrimEnd();
                Modelo.Lote = FuncionSAP.Imports["EX_CHARG"]?.ParamValue?.ToString().Trim();
                Modelo.Orden = FuncionSAP.Imports["EX_AUFNR"]?.ParamValue?.ToString().Trim();

                if(Modelo.Orden != string.Empty)
                    Modelo.EstatusValidacionOrden = 1;
                else
                    Modelo.EstatusValidacionOrden = 2;
            }
            catch (Exception excepcion)
            {
                Modelo.EstatusValidacionOrden = -1;
                Modelo.Mensaje = excepcion.Message;
            }

            return Modelo;
        }
    }
}
