namespace IndicadoresOEE.Common.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public class ParoModel
    {
        [DataMember]
        public long Indice { get; set; }
        [DataMember]
        public string Nombre { get; set; }
        [DataMember]
        public int Cantidad { get; set; }
        [DataMember]
        public string Folio { get; set; }
        [DataMember]
        public bool EsParoPlanificado { get; set; }
    }
}
