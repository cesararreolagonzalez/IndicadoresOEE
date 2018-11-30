namespace IndicadoresOEE.Common.Models
{
    using System;
    using System.Runtime.Serialization;

    [DataContract]
    public class BitacoraErroresModel
    {
        [DataMember]
        public long Indice { get; set; }
        [DataMember]
        public string Error { get; set; }
        [DataMember]
        public DateTime Fecha { get; set; }
        [DataMember]
        public string Usuario { get; set; }
        [DataMember]
        public string Seccion { get; set; }
    }
}
