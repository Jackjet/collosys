﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using ColloSys.DataLayer.ClientData;
using ColloSys.DataLayer.Domain;
using ColloSys.DataLayer.Enumerations;
using ColloSys.DataLayer.Infra.SessionMgr;
using ColloSys.FileUploader.ExcelReader.FileReader;
using ColloSys.FileUploader.ExcelReaders.ExcelReader;
using ColloSys.FileUploader.ExcelReaders.RecordSetter;
using FileUploader.ExcelReader;
using NUnit.Framework;
using ReflectionExtension.ExcelReader;

namespace ReflectionExtension.Tests.ExcelReader.Test
{
    [TestFixture]
    class ExcelRecordSetTest : SetUpAssemblies
    {
        private RlsPaymentLinerRecordCreator _record;
        private ICounter _counter;
        private IExcelReader _excelReader;
        private ColloSys.FileUploader.ExcelReader.FileReader.IFileReader<Payment> _fileReader;
        private ExcelReaderHelper _excelReaderHelper;
        private Payment _obj;
        private IList<string> EPaymentExcludeCode;
        [SetUp]
        public void Init()
        {
            _obj = new Payment();
            _record = new RlsPaymentLinerRecordCreator(EPaymentExcludeCode);
            _excelReaderHelper = new ExcelReaderHelper();
            _excelReader = _excelReaderHelper.GetInstance(FileInfo);
            _fileReader = new  ColloSys.FileUploader.ExcelReaders.FileReader.RlsPaymentFileReader();
            _counter = new ExcelRecordCounter();
       
        }

        [Test]
        public void Test_ExcelRecord_UinqExcelMapper()
        {
            var data = SessionManager.GetCurrentSession().QueryOver<FileMapping>()
                .Where(d => d.ValueType == ColloSysEnums.FileMappingValueType.ExcelValue)
                .Where(d => d.FileDetail.Id == Guid.Parse("A42EF611-808D-4CC2-9F6F-D15069664D4C")).List<FileMapping>();
            _excelReader.Skip(2);
            _record.ExcelMapper(_obj, _excelReader, data, _counter);
            Assert.AreEqual(_obj.AccountNo, "");
        }

        [Test]
        public void Test_ExcelRecord_AccountNo()
        {
            var data = SessionManager.GetCurrentSession().QueryOver<FileMapping>()
                .Where(d => d.ValueType == ColloSysEnums.FileMappingValueType.ExcelValue)
                .Where(d => d.FileDetail.Id == Guid.Parse("A42EF611-808D-4CC2-9F6F-D15069664D4C"))
                .List<FileMapping>();
            _excelReader.Skip(3);
            _record.ExcelMapper(_obj, _excelReader, data, _counter);
            Assert.AreEqual(_obj.AccountNo, "42297532");
        }

        [Test]
        public void Test_Defaultvalue_Of_Enum_Type()
        {
            var data = SessionManager.GetCurrentSession().QueryOver<FileMapping>()
                .Where(d => d.ValueType == ColloSysEnums.FileMappingValueType.DefaultValue)
                .Where(d => d.FileDetail.Id == Guid.Parse("A42EF611-808D-4CC2-9F6F-D15069664D4C"))
                .List<FileMapping>();
            _record.DefaultMapper(_obj, data, _counter);
            Assert.AreEqual(_obj.BillStatus, ColloSysEnums.BillStatus.Unbilled);
        }

        [Test]
        public void Test_Computedvalue_And_Set()
        {
            _excelReader.Skip(2);
            _record.ComputedSetter(_obj, _excelReader,_counter);
            Assert.AreEqual(_obj.TransAmount.ToString(CultureInfo.InvariantCulture), "11158.36");
        }

        [Test]
        public void Test_CreateRecord_IgnoreRecordCount()
        {

            var data = GetFileMappings("A42EF611-808D-4CC2-9F6F-D15069664D4C");
            _excelReader.Skip(2);
            _record.CreateRecord(_obj, _excelReader, data, _counter);
            Assert.AreEqual(_counter.IgnoreRecord, 1);
        }

        [Test]
        public void Test_CreateRecord_ValidRecord_Count()
        {
            var data = GetFileMappings("A42EF611-808D-4CC2-9F6F-D15069664D4C");
            _excelReader.Skip(2);
            _fileReader.ReadAndSaveBatch(_obj, _excelReader, data, _counter,50);
            Assert.AreEqual(_counter.ValidRecords, 14);
        }
        [Test]
        public void Test_CreateRecord_Ignore_Record_Count()
        {
            var data = GetFileMappings("A42EF611-808D-4CC2-9F6F-D15069664D4C");
            _excelReader.Skip(2);
            _fileReader.ReadAndSaveBatch(_obj, _excelReader, data, _counter, 50);
            Assert.AreEqual(_counter.IgnoreRecord, 3);
        }

        [Test]
        public void Test_CreateRecord_Insert_Record_Count()
        {
            var data = GetFileMappings("A42EF611-808D-4CC2-9F6F-D15069664D4C");
            _excelReader.Skip(2);
            _fileReader.ReadAndSaveBatch(_obj, _excelReader, data, _counter, 50);
            Assert.AreEqual(_counter.InsertRecord, 14);
        }

        [Test]
        public void Test_CreateRecord_Error_Record_Count()
        {
            var data = GetFileMappings("A42EF611-808D-4CC2-9F6F-D15069664D4C");
            _excelReader.Skip(2);
            _fileReader.ReadAndSaveBatch(_obj, _excelReader, data, _counter, 50);
            Assert.AreEqual(_counter.ErrorRecords, 1);
        }

        [Test]
        public void Test_DebitAmount_Of_one_InvlidRecord()
        {
            var data = GetFileMappings("A42EF611-808D-4CC2-9F6F-D15069664D4C");
            _excelReader.Skip(2);
            _fileReader.ReadAndSaveBatch(_obj, _excelReader, data, _counter, 50);
         //   Assert.AreEqual(FileReader<Payment>.ObjList.ElementAt(7).DebitAmount, 0);
        }

        [Test]
        public void Test_DebitAmount_Of_one_validRecord()
        {
            var data = GetFileMappings("A42EF611-808D-4CC2-9F6F-D15069664D4C");
            _excelReader.Skip(2);
            _fileReader.ReadAndSaveBatch(_obj, _excelReader, data, _counter, 50);
           // Assert.AreEqual(FileReader<Payment>.ObjList.ElementAt(4).DebitAmount, 31500);
        }
        public static IList<FileMapping> GetFileMappings(string guId)
        {
            return  SessionManager.GetCurrentSession().QueryOver<FileMapping>()
                .Where(d => d.FileDetail.Id == Guid.Parse(guId))
                .List<FileMapping>();
        }

    }
}
