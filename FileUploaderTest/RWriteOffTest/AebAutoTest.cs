﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ColloSys.DataLayer.ClientData;
using ColloSys.DataLayer.Domain;
using ColloSys.DataLayer.Enumerations;
using ColloSys.FileUploaderService.AliasPayment;
using ColloSys.FileUploaderService.AliasWriteOff.Ebbs;
using ColloSys.FileUploaderService.AliasWriteOff.Rls;
using ColloSys.FileUploaderService.FileReader;
using NUnit.Framework;

namespace ReflectionExtension.Tests.EWriteOffTest
{
    public class AebAutoTest : FileProvider
    {
        #region ctor

        private IFileReader<RWriteoff> _paymentLiner;
        RWriteoff _record = new RWriteoff();

        [SetUp]
        public void Init()
        {
            var fileDate = new DateTime(2013, 08, 17);
            const string fileDirectory = "C:/Users/Ast011/Documents/collosys";
            var mappingData = new FileDataProvider(fileDate,fileDirectory);
            var fileScheduler = mappingData.GetUploadedFile(ColloSysEnums.FileAliasName.R_WRITEOFF_AUTO_AEB);
            _paymentLiner = new RWriteOffAutoAebFR(fileScheduler);
        }

        #endregion

        [Test]
        public void Test_CreateRecord_Assigning_ValidMapping_Check_AccNo()
        {
            _paymentLiner.ExcelReader.Skip(3);
           var record= _paymentLiner.RecordCreatorObj.CreateRecord(_paymentLiner.FileScheduler.FileDetail.FileMappings, out _record);
           
            //Assert
            Assert.AreEqual(_record.AccountNo, "12345678902");
        }
    }
}
