namespace IndicadoresOEE.Common.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public class ProcesoModel
    {
        [DataMember]
        public long Indice { get; set; }
        [DataMember]
        public string Nombre { get; set; }
        [DataMember]
        public long IndiceLinea { get; set; }
    }
}
