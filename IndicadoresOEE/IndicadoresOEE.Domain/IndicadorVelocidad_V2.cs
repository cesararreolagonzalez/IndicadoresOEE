//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace IndicadoresOEE.Domain
{
    using System;
    using System.Collections.Generic;
    
    public partial class IndicadorVelocidad_V2
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public IndicadorVelocidad_V2()
        {
            this.Indicador_V2 = new HashSet<Indicador_V2>();
        }
    
        public long Indice { get; set; }
        public long IndiceCentro { get; set; }
        public long IndiceDepartamento { get; set; }
        public long IndiceLinea { get; set; }
        public long IndiceProceso { get; set; }
        public long Material { get; set; }
        public int Velocidad { get; set; }
        public bool Activo { get; set; }
        public Nullable<int> VelocidadNominal { get; set; }
        public Nullable<int> VelocidadEquivalencia { get; set; }
        public Nullable<decimal> FactorEquivalencia { get; set; }
        public Nullable<decimal> VelocidadesUnidadesEquivalentes { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Indicador_V2> Indicador_V2 { get; set; }
        public virtual Proceso Proceso { get; set; }
    }
}
