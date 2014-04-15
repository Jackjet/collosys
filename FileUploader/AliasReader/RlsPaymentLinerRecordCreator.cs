﻿#region references

using System;
using System.Collections.Generic;
using System.Globalization;
using ColloSys.DataLayer.ClientData;
using ColloSys.DataLayer.Domain;
using NLog;
using ReflectionExtension.ExcelReader;

#endregion


namespace ColloSys.FileUploader.AliasReader
{
    public class RlsPaymentLinerRecordCreator : IAliasRecordCreator<Payment>
    {
        private readonly Logger _log = LogManager.GetCurrentClassLogger();
        private readonly FileScheduler _uploadedFile;
        private readonly IList<int> _paymentcodes;

        public RlsPaymentLinerRecordCreator(FileScheduler fileScheduler)
        {
            _uploadedFile = fileScheduler;
            _paymentcodes = new List<int> { 179, 201, 203, 891 };
        }

        public bool ComputedSetter(Payment record, IExcelReader reader, ICounter counter)
        {
            try
            {
                record.FileDate = _uploadedFile.FileDate;
                record.IsDebit = _paymentcodes.Contains(record.TransCode);
                var amountdiff = record.DebitAmount - (record.CreditAmount.HasValue ? record.CreditAmount.Value : 0);
                record.TransAmount = amountdiff * (amountdiff < 0 ? -1 : 1);
                return true;
            }
            catch (Exception exception)
            {
                throw new Exception("Computted value has not set", exception);
            }
        }

        public bool CheckBasicField(IExcelReader reader, ICounter counter)
        {
            var loanNo = reader.GetValue(3);

            ulong loanNumber;
            if (!ulong.TryParse(loanNo, out loanNumber) || (loanNumber.ToString(CultureInfo.InvariantCulture).Length < 3))
            {
                _log.Debug(string.Format("Data is rejected, Because account No {0} is not valid number", loanNo));
                counter.IncrementIgnoreRecord();
                return false;
            }
            return true;
        }

        public bool IsRecordValid(Payment record)
        {
            return true;
        }

        public bool ComputedSetter(Payment obj, Payment yobj, IExcelReader reader, IEnumerable<FileMapping> mapplings)
        {
            return true;
        }

    }
}
