namespace IndicadoresOEE.Common.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public class CentroModel
    {
        [DataMember]
        public long Indice { get; set; }
        [DataMember]
        public string Nombre { get; set; }
    }
}
