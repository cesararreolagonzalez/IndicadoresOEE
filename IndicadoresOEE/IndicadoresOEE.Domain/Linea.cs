//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace IndicadoresOEE.Domain
{
    using System;
    using System.Collections.Generic;
    
    public partial class Linea
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Linea()
        {
            this.ParosPlaneadosMes_V2 = new HashSet<ParosPlaneadosMes_V2>();
            this.Proceso = new HashSet<Proceso>();
        }
    
        public long id_linea { get; set; }
        public string nombre { get; set; }
        public Nullable<long> id_departamento { get; set; }
        public Nullable<byte> eliminado { get; set; }
    
        public virtual Departamento Departamento { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ParosPlaneadosMes_V2> ParosPlaneadosMes_V2 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Proceso> Proceso { get; set; }
    }
}