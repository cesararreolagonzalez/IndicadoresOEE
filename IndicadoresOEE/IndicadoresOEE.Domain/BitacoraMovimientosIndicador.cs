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
    
    public partial class BitacoraMovimientosIndicador
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public BitacoraMovimientosIndicador()
        {
            this.BitacoraIndicador = new HashSet<BitacoraIndicador>();
        }
    
        public int Indice { get; set; }
        public string Nombre { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<BitacoraIndicador> BitacoraIndicador { get; set; }
    }
}