﻿#region references

using System.Collections.Generic;
using System.IO;
using System.Linq;
using ColloSys.DataLayer.Domain;
using ColloSys.DataLayer.Enumerations;
using ColloSys.FileUploader.AliasReader;
using ColloSys.FileUploader.Reflection;
using ColloSys.FileUploader.RowCounter;
using ColloSys.FileUploader.Utilities;
using ReflectionExtension.ExcelReader;

#endregion

namespace ColloSys.FileUploader.RecordCreator
{
    public class RecordCreator<TEntity> : IRecord<TEntity> where TEntity : class , new()
    {
        #region ctor
        private readonly IAliasRecordCreator<TEntity> _recordCreator;
        public readonly IExcelReader Reader;
        private readonly ICounter _counter;
        public RecordCreator(IAliasRecordCreator<TEntity> recordCreator,IExcelReader reader)
        {
            _recordCreator = recordCreator;
            Reader = reader;
            _counter =new ExcelRecordCounter();
        }
        #endregion

        #region IRecord
        public bool ExcelMapper(TEntity obj, IEnumerable<FileMapping> mappings)
        {
            foreach (var info in mappings)
            {
                try
                {
                    var data = Reader.GetValue(info.Position);
                    ReflectionHelper.SetValue(info.ActualColumn, data, obj);
                }
                catch
                {
                    _counter.IncrementErrorRecords();
                    _counter.IncrementTotalRecords();
                   return false;
                }
            }
            return true;
        }

        public bool DefaultMapper(TEntity obj, IEnumerable<FileMapping> mapings)
        {
            foreach (var mapping in mapings)
            {
                try
                {
                    ReflectionHelper.SetValue(mapping.ActualColumn, mapping.DefaultValue, obj);
                }
                catch
                {
                    _counter.IncrementErrorRecords();
                    _counter.IncrementTotalRecords();
                    return false;
                }

            }
            return true;
        }

        public bool CreateRecord(TEntity obj, IEnumerable<FileMapping> mappingss)
        {
            bool excelstatus = false, defaultMap = false, computedMap = true;

            var excelType = GetMappings(ColloSysEnums.FileMappingValueType.ExcelValue, mappingss);
            if (excelType.Any())
            {
                if (!_recordCreator.CheckBasicField(Reader, _counter))
                    return false;

                excelstatus = ExcelMapper(obj, excelType);
            }
            if (!excelstatus || !_recordCreator.IsRecordValid(obj, _counter)) return false;

            var defaultType = GetMappings(ColloSysEnums.FileMappingValueType.DefaultValue, mappingss);
            var typeDefault = defaultType as FileMapping[] ?? defaultType.ToArray();
            if (typeDefault.Any())
            {
                defaultMap = DefaultMapper(obj, typeDefault);
            }

            var computedType = GetMappings(ColloSysEnums.FileMappingValueType.ComputedValue, mappingss);
            var typeComputed = computedType as FileMapping[] ?? computedType.ToArray();
            if (typeComputed.Any())
            {
                computedMap = _recordCreator.ComputedSetter(obj, Reader, _counter);
            }
            if (!defaultMap || !computedMap) return false;

            _counter.IncrementInsertRecords();
            _counter.IncrementValidRecords();
            _counter.IncrementTotalRecords();
            return true;
        }

        public IList<FileMapping> GetMappings(ColloSysEnums.FileMappingValueType eNumType, IEnumerable<FileMapping> mappingss)
        {
            return mappingss.Where(x => x.ValueType == eNumType).ToList();
        }
        #endregion
    }
}
