namespace IndicadoresOEE.Common.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public class ValidacionOrdenSAPModel
    {
        [DataMember]
        public string Material { get; set; }
        [DataMember]
        public string Descripcion { get; set; }
        [DataMember]
        public string Lote { get; set; }
        [DataMember]
        public string Orden { get; set; }
        [DataMember]
        public string Mensaje { get; set; }
        [DataMember]
        public int EstatusValidacionOrden { get; set; }
        
    }
}
