namespace IndicadoresOEE.Domain.Business
{
    using IndicadoresOEE.Common.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Common.Util;

    public class ParoBusiness
    {
        private readonly PrimaryConnection db;

        public ParoBusiness()
        {
            db = new PrimaryConnection();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IndiceUsuario"></param>
        /// <param name="IndiceDepartamento"></param>
        /// <returns></returns>
        public List<ParoModel> ObtenerParosPorGerarquia(long IndiceParo, long IndiceProceso)
        {
            List<ParoModel> ListaParos = new List<ParoModel>();
            
            if(IndiceParo == 0)
            {
                ListaParos = db.Paro
                    .Where(columna => columna.nivel == 1 && columna.id_proceso == IndiceProceso && columna.eliminado == 0)
                    .Select(columna => new { Indice = columna.id_paro, Nombre = columna.descripcion })
                    .ToList()
                    .Where(columna => !Util.ListaParosPlanificados.Contains(columna.Nombre, StringComparer.InvariantCultureIgnoreCase))
                    .Select(columna => new ParoModel()
                    {
                        Indice = columna.Indice,
                        Nombre = columna.Nombre
                    })
                    .OrderBy(columna => columna.Nombre)
                    .ToList();
            }
            else
            {
                ListaParos = db.Paro
                    .Where(columna => columna.paro_padre == IndiceParo && columna.id_proceso == IndiceProceso && columna.eliminado == 0)
                    .Select(columna => new { Indice = columna.id_paro, Nombre = columna.descripcion })
                    .ToList()
                    .Select(columna => new ParoModel()
                    {
                        Indice = columna.Indice,
                        Nombre = columna.Nombre
                    })
                    //.Distinct()
                    .OrderBy(columna => columna.Nombre)
                    .ToList();
            }

            return ListaParos;
        }

        public bool AgregarParo(long indiceIndicador, long indiceParo, int cantidad, string folio)
        {
            bool Estado = false;

            if (cantidad > 0)
            {
                Paro paro = db.Paro
                    .Where(columna => columna.id_paro == indiceParo)
                    .FirstOrDefault();

                if (paro != null)
                {
                    IndicadorParo_V2 IndicadorParo = new IndicadorParo_V2
                    {
                        IndiceIndicador = indiceIndicador,
                        IndiceParo = indiceParo,
                        Cantidad = cantidad,
                        Folio = (folio != null && folio != "") ? folio : null,
                        EsParoPlanificado = false
                    };

                    try
                    {
                        db.IndicadorParo_V2.Add(IndicadorParo);
                        db.SaveChanges();
                        Estado = true;
                    }
                    catch (Exception)
                    {

                    }
                }
            }

            return Estado;
        }

        public ParoModel BuscarParo(string nombre)
        {
            ParoModel paroModelo = null;

            Paro paro = db.Paro.Where(c => c.descripcion.Contains(nombre)).FirstOrDefault();

            if(paro != null)
            {
                paroModelo = new ParoModel()
                {
                    Indice = paro.id_paro,
                    Nombre = paro.descripcion
                };
            }

            return paroModelo;
        }

        public ParoModel BuscarParo(long indice)
        {
            ParoModel paroModelo = null;

            Paro paro = db.Paro.Where(c => c.id_paro == indice).FirstOrDefault();

            if(paro != null)
            {
                paroModelo = new ParoModel()
                {
                    Indice = paro.id_paro,
                    Nombre = paro.descripcion
                };
            }

            return paroModelo;
        }

        public long CrearParo(long indiceProceso, string nombre, int nivel, int? indiceParoPadre)
        {
            long IndiceParo = 0;

            try
            {
                Paro paro = new Paro()
                {
                    nivel = nivel,
                    paro_padre = indiceParoPadre,
                    descripcion = nombre,
                    id_proceso = indiceProceso,
                    programado = 0,
                    eliminado = 0
                };

                db.Paro.Add(paro);
                db.SaveChanges();

                IndiceParo = paro.id_paro;
            }
            catch (Exception)
            {
            }

            return IndiceParo;
        }
    }
}
