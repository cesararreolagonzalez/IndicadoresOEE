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
    
    public partial class Proceso_Velocidad
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Proceso_Velocidad()
        {
            this.Indicador = new HashSet<Indicador>();
        }
    
        public long id_velocidad { get; set; }
        public long id_proceso { get; set; }
        public Nullable<int> velocidad { get; set; }
        public string unidades { get; set; }
        public Nullable<byte> eliminado { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Indicador> Indicador { get; set; }
        public virtual Proceso Proceso { get; set; }
    }
}
