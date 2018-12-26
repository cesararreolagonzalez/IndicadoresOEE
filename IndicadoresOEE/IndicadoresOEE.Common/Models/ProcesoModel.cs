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
        [DataMember]
        public string NombreLinea { get; set; }
        [DataMember]
        public string NombreCentro { get; set; }
        [DataMember]
        public string NombreDepartamento { get; set; }
    }
}
