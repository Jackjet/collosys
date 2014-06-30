﻿#region references

using System;
using System.Collections.Generic;
using System.Globalization;
using ColloSys.DataLayer.Domain;
using ColloSys.FileUploaderService.RecordManager;
using NLog;

#endregion

namespace ColloSys.FileUploaderService.AliasWriteOff.Ebbs
{
    // ReSharper disable once InconsistentNaming
    public abstract class EWriteOffSharedRC : RecordCreator<EWriteoff>
    {
        private uint AccountPosition { get; set; }
        private uint AccountLength { get; set; }
        private uint ProductPosition { get; set; }
        private readonly Logger _log = LogManager.GetCurrentClassLogger();

        public EWriteOffSharedRC(uint accountPos, uint accountLength, uint productPos)
        {
            AccountPosition = accountPos;
            AccountLength = accountLength;
            ProductPosition = productPos;
        }

        public override bool ComputedSetter(EWriteoff entity)
        {
            try
            {
                entity.FileDate = FileScheduler.FileDate.Date;
                entity.Allocs = null;
                entity.AccountNo = ulong.Parse(Reader.GetValue(AccountPosition))
                    .ToString("D" + AccountPosition.ToString(CultureInfo.InvariantCulture));

                var value = GetValueForIsSettled();
                entity.IsSetteled = !string.IsNullOrWhiteSpace(value)
                    && value.Trim().ToUpperInvariant() == "Y";
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public override bool ComputedSetter(EWriteoff entity, EWriteoff preEntity)
        {
            return true;
        }

        public override bool IsRecordValid(EWriteoff entity)
        {
            return true;
        }

        public override bool CheckBasicField()
        {
            // loan no should be a number
            ulong loanNumber;
            if (!ulong.TryParse(Reader.GetValue(AccountPosition), out loanNumber))
            {
                //Counter.IncrementIgnoreRecord();
                _log.Debug(string.Format("Data is rejected, Because account No {0} is not valid number", Reader.GetValue(AccountPosition)));
                return false;
            }

            var product = Reader.GetValue(ProductPosition);
            if (string.IsNullOrWhiteSpace(product))
            {
                return false;
            }

            // loan number must be of 2 digits min
            return (loanNumber.ToString(CultureInfo.InvariantCulture).Length >= 2);
        }

        public override EWriteoff GetRecordForUpdate()
        {
            var accno = Reader.GetValue(AccountPosition).ToString(CultureInfo.InvariantCulture);
            return TodayRecordList.GetEntity(accno) ??
                new EWriteoff();
            //return DbLayer.GetRecordForUpdate<EWriteoff>(Reader.GetValue(AccountPosition).ToString(CultureInfo.InvariantCulture))
            //    ?? new EWriteoff();
        }

        public override EWriteoff GetPreviousDayEntity(EWriteoff entity)
        {
            throw new NotImplementedException();
        }

        public abstract string GetValueForIsSettled();
    }
}