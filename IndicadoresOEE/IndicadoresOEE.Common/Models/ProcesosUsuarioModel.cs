namespace IndicadoresOEE.Common.Models
{
    using System.Runtime.Serialization;

    [DataContract]
    public class ProcesosUsuarioModel
    {
        [DataMember]
        public CentroModel Centro { get; set; }
        [DataMember]
        public DepartamentoModel Departamento { get; set; }
        [DataMember]
        public LineaModel Linea { get; set; }
        [DataMember]
        public ProcesoModel Proceso { get; set; }
    }
}
