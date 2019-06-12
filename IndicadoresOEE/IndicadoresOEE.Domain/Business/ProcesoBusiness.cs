namespace IndicadoresOEE.Domain.Business
{
    using IndicadoresOEE.Common.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class ProcesoBusiness
    {
        private readonly PrimaryConnection db;

        public ProcesoBusiness()
        {
            db = new PrimaryConnection();
        }

        public List<ProcesosUsuarioModel> ObtenerProcesosPorUsuario(long IndiceUsuario)
        {
             var ListaProcesos = db.vw_usuarios_procesos.Where(u => u.IndiceUsuario == IndiceUsuario)
                .Select(c => new {
                    c.IndiceCentro,
                    c.NombreCentro,
                    c.IndiceDepartamento,
                    c.NombreDepartamento,
                    c.IndiceLinea,
                    c.NombreLinea,
                    c.IndiceProceso,
                    c.NombreProceso
                })
                .ToList()
                .Select(c => new ProcesosUsuarioModel()
                {
                    Centro = new CentroModel() { Indice = c.IndiceCentro, Nombre = c.NombreCentro },
                    Departamento = new DepartamentoModel() { Indice = c.IndiceDepartamento, Nombre = c.NombreDepartamento },
                    Linea = new LineaModel() { Indice = c.IndiceLinea, Nombre = c.NombreLinea },
                    Proceso = new ProcesoModel() { Indice = c.IndiceProceso, Nombre = c.NombreProceso }
                })
                .ToList();

            return ListaProcesos;
        }


        public List<long> ObtenerProcesosPorUsuario(long IndiceUsuario, long IndiceProceso, long IndiceLinea, 
        long IndiceDepartamento, long IndiceCentro)
        {
            var procesos = db.vw_usuarios_procesos.Where(u => u.IndiceUsuario == IndiceUsuario);

            if (IndiceProceso > 0)
                procesos = procesos.Where(columna => columna.IndiceProceso == IndiceProceso);
            else if (IndiceLinea > 0)
                procesos = procesos.Where(columna => columna.IndiceLinea == IndiceLinea);
            else if (IndiceDepartamento > 0)
                procesos = procesos.Where(columna => columna.IndiceDepartamento == IndiceDepartamento);
            else if (IndiceCentro > 0)
                procesos = procesos.Where(columna => columna.IndiceCentro == IndiceCentro);

            List<long> ListaProcesos = procesos.Select(columna => columna.IndiceProceso).ToList();

            return ListaProcesos;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceUsuario"></param>
        /// <param name="IndiceDepartamento"></param>
        /// <returns></returns>
        public List<ProcesoModel> ObtenerProcesosPorLinea(long IndiceUsuario, long IndiceLinea)
        {
            List<ProcesoModel> ListaProcesos =
                   db.Proceso.Where(c => c.Usuario.Any(d => d.id_usuario == IndiceUsuario))
                   .Select(c => new
                   {
                       IndiceLinea = c.id_linea ?? 0,
                       IndiceProceso = c.id_proceso,
                       Nombre = c.nombre
                   })
                   .Where(c => c.IndiceLinea == IndiceLinea)
                   .GroupBy(c => c.IndiceProceso)
                   .ToList()
                   .Select(c => new ProcesoModel { Indice = c.Key, Nombre = c.Max(d => d.Nombre) })
                   .OrderBy(c => c.Nombre)
                   .ToList();

            return ListaProcesos;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceUsuario"></param>
        /// <param name="IndiceDepartamento"></param>
        /// <returns></returns>
        public List<ProcesoModel> ObtenerProcesosPorLineas(long IndiceUsuario, long[] IndiceLinea)
        {
            List<ProcesoModel> ListaProcesos = new List<ProcesoModel>();

            ListaProcesos = db
                .vw_usuarios_procesos
                .Where(columna => columna.IndiceUsuario == IndiceUsuario && IndiceLinea.Contains(columna.IndiceLinea))
                .Select(columna => new
                {
                    columna.IndiceProceso,
                    columna.NombreProceso,
                    columna.IndiceLinea,
                    NombreCentro = db.Centro.Where(c => c.id_centro == columna.IndiceCentro).Select(c => c.nombre).FirstOrDefault(),
                    NombreDepartamento = db.Departamento.Where(c => c.id_departamento == columna.IndiceDepartamento).Select(c => c.nombre).FirstOrDefault(),
                    NombreLinea = db.Linea.Where(c => c.id_linea == columna.IndiceLinea).Select(c => c.nombre).FirstOrDefault()
                })
                .Distinct()
                .GroupBy(columna => columna.IndiceProceso)
                .SelectMany(fila => fila)
                .Select(columna => new ProcesoModel() { Indice = columna.IndiceProceso, Nombre = columna.NombreProceso.ToUpper(), IndiceLinea = columna.IndiceLinea, NombreCentro = columna.NombreCentro.ToUpper(), NombreDepartamento = columna.NombreDepartamento.ToUpper(), NombreLinea = columna.NombreLinea.ToUpper() })
                .OrderBy(columna => columna.Nombre)
                .ToList();

            return ListaProcesos;
        }

        public bool EliminarProcesos(long IndiceUsuario, long[] ListaIndicesProcesos)
        {
            var ListaProcesos =
                   db.Proceso.Where(c => c.Usuario.Any(d => d.id_usuario == IndiceUsuario) 
                   && ListaIndicesProcesos.Contains(c.id_proceso))
                   .ToList();

            db.Proceso.RemoveRange(ListaProcesos);
            //db.SaveChanges();

            return false;
        }

        public bool AsociarProcesosUsuario(long IndiceUsuario, long[] ListaIndicesProcesos)
        {
            var ListaProcesos =
                   db.Proceso.Where(c => ListaIndicesProcesos.Contains(c.id_proceso))
                   .ToList();

            var Usuario = db.Usuario.Find(IndiceUsuario);
            if(Usuario != null)
            {
                foreach(var Proceso in ListaProcesos)
                    Usuario.Proceso.Add(Proceso);
                
                //db.SaveChanges();
                return true;
            }

            return false;
        }
    }
}
