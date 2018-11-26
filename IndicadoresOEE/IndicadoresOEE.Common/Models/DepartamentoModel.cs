namespace IndicadoresOEE.Common.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public class DepartamentoModel
    {
        [DataMember]
        public long Indice { get; set; }
        [DataMember]
        public string Nombre { get; set; }
        [DataMember]
        public long IndiceCentro { get; set; }
    }
}
