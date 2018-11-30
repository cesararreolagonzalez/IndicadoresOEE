namespace IndicadoresOEE.Common.Models
{
    using System;
    using System.Runtime.Serialization;

    [DataContract]
    public class BitacoraAccesosModel
    {
        [DataMember]
        public long Indice { get; set; }
        [DataMember]
        public DateTime Fecha { get; set; }
        [DataMember]
        public string Usuario { get; set; }
        [DataMember]
        public string Seccion { get; set; }
    }
}
