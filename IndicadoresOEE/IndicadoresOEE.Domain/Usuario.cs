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
    
    public partial class Usuario
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Usuario()
        {
            this.Bitacora = new HashSet<Bitacora>();
            this.UsuarioCapacidad = new HashSet<UsuarioCapacidad>();
            this.Proceso = new HashSet<Proceso>();
        }
    
        public long id_usuario { get; set; }
        public string nombre { get; set; }
        public string apellidos { get; set; }
        public string usuario1 { get; set; }
        public string clave { get; set; }
        public Nullable<int> id_perfil { get; set; }
        public Nullable<bool> estado { get; set; }
        public Nullable<System.DateTime> ultimo_ingreso { get; set; }
        public Nullable<System.DateTime> ultima_renovacion { get; set; }
        public Nullable<byte> directorio_activo { get; set; }
        public Nullable<byte> eliminado { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Bitacora> Bitacora { get; set; }
        public virtual Perfil Perfil { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<UsuarioCapacidad> UsuarioCapacidad { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Proceso> Proceso { get; set; }
    }
}
