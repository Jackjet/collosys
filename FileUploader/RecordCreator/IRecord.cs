﻿using System.Collections.Generic;
using ColloSys.DataLayer.Domain;
using ColloSys.DataLayer.Enumerations;
using ColloSys.FileUploader.RowCounter;

namespace ColloSys.FileUploader.RecordCreator
{
    public interface IRecord<in TEntity> where TEntity : class , new()
    {
        IList<FileMapping> GetMappings(ColloSysEnums.FileMappingValueType eNumType, IEnumerable<FileMapping> mappingss);

        bool ExcelMapper(TEntity obj, IEnumerable<FileMapping> mapings);

        bool DefaultMapper(TEntity obj, IEnumerable<FileMapping> mapings);

        bool CreateRecord(TEntity obj, IEnumerable<FileMapping> mapings,ICounter counter);
    }
}
