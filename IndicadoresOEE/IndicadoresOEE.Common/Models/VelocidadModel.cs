namespace IndicadoresOEE.Common.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public class VelocidadModel
    {
        [DataMember]
        public long Indice { get; set; }
        [DataMember]
        public string Nombre { get; set; }
        [DataMember]
        public long IndiceProceso { get; set; }
    }

}
