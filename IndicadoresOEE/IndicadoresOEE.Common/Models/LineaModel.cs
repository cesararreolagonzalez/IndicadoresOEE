namespace IndicadoresOEE.Common.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public class LineaModel
    {
        [DataMember]
        public long Indice { get; set; }
        [DataMember]
        public string Nombre { get; set; }
        [DataMember]
        public long IndiceDepartamento { get; set; }
        [DataMember]
        public string NombreCentro { get; set; }
        [DataMember]
        public string NombreDepartamento { get; set; }
    }
}
