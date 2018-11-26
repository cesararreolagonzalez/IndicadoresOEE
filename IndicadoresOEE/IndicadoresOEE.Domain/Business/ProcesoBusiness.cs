namespace IndicadoresOEE.Domain.Business
{
    using IndicadoresOEE.Common.Models;
    using System.Collections.Generic;
    using System.Linq;

    public class ProcesoBusiness
    {
        private readonly PrimaryConnection db;

        public ProcesoBusiness()
        {
            db = new PrimaryConnection();
        }
        
        public List<long> ObtenerProcesosPorUsuario(long IndiceUsuario, long IndiceProceso, long IndiceLinea, long IndiceDepartamento, long IndiceCentro)
        {
            var procesos = db.vw_usuarios_procesos.Where(u => u.id_usuario == IndiceUsuario);

            if (IndiceProceso > 0)
                procesos = procesos.Where(columna => columna.id_proceso == IndiceProceso);
            else if (IndiceLinea > 0)
                procesos = procesos.Where(columna => columna.id_linea == IndiceLinea);
            else if (IndiceDepartamento > 0)
                procesos = procesos.Where(columna => columna.id_departamento == IndiceDepartamento);
            else if (IndiceCentro > 0)
                procesos = procesos.Where(columna => columna.id_centro == IndiceCentro);

            List<long> ListaProcesos = procesos.Select(s => s.id_proceso).ToList();

            return ListaProcesos;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceUsuario"></param>
        /// <param name="IndiceDepartamento"></param>
        /// <returns></returns>
        public List<ProcesoModel> ObtenerProcesos(long IndiceUsuario, long IndiceLinea)
        {
            List<ProcesoModel> ListaProcesos = new List<ProcesoModel>();

            ListaProcesos = db
                            .vw_usuarios_procesos
                            .Where(columna => columna.id_usuario == IndiceUsuario && columna.id_linea == IndiceLinea)
                            .Select(columna => new { Indice = columna.id_proceso, Nombre = columna.nombre_proceso })
                            .Distinct()
                            .ToList()
                            .Select(columna => new ProcesoModel() { Indice = columna.Indice, Nombre = columna.Nombre, IndiceLinea = IndiceLinea })
                            .OrderBy(columna => columna.Nombre)
                            .ToList();

            return ListaProcesos;
        }
    }
}
