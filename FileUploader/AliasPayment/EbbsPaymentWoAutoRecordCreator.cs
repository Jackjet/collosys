﻿#region references

using System;
using System.Collections.Generic;
using ColloSys.DataLayer.ClientData;
using ColloSys.DataLayer.Enumerations;

#endregion

namespace ColloSys.FileUploaderService.AliasPayment
{
    public class EbbsPaymentWoAutoRecordCreator : PaymentRecordCreator
    {
        #region ctor

        private const uint AccountPosition = 1;
        private const uint AccountLength = 11;
        private readonly IList<string> _ePaymentExcludeCodes;

        public EbbsPaymentWoAutoRecordCreator()
            : base(AccountPosition, AccountLength)
        {
            _ePaymentExcludeCodes = DbLayer.GetValuesFromKey(ColloSysEnums.Activities.FileUploader, "EPaymentExcludeCode");
        }

        #endregion

        #region overrdies
        protected override bool GetComputations(Payment record)
        {
            try
            {
                var shouldBeExclude = _ePaymentExcludeCodes.Contains(string.Format("{0}@{1}",
                    record.TransCode, record.TransDesc.Trim()));
                record.IsExcluded = shouldBeExclude;

                record.ExcludeReason = string.Format("TransCode : {0}, and TransDesc : {1}",
                    record.TransCode, record.TransDesc);

                return true;
            }
            catch (Exception exception)
            {
                throw new Exception("Ebbs Computted setter in not set", exception);
            }
        }

        public override bool IsRecordValid(Payment record)
        {
            if (record.TransDate.Month != FileScheduler.FileDate.Month)
            {
                Counter.IncrementIgnoreRecord();
                return false;
            }
            return true;
        }
        #endregion
    }
}
