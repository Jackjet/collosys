﻿#region references

using System;
using System.Collections.Generic;
using ColloSys.DataLayer.Allocation;
using ColloSys.DataLayer.ClientData;
using ColloSys.DataLayer.Components;
using ColloSys.DataLayer.Enumerations;
using ColloSys.DataLayer.Generic;
using ColloSys.DataLayer.SharedDomain;

#endregion

namespace ColloSys.DataLayer.Domain
{
    public class CWriteoff : UploadableEntity, IDelinquentCustomer, IUniqueKey
    {
        #region Properties
        public virtual string AccountNo { get; set; }
        public virtual string CustomerName { get; set; }
        public virtual uint Cycle { get; set; }
        public virtual string Location { get; set; }
        public virtual string Block { get; set; }
        public virtual string AltBlock { get; set; }
        public virtual decimal TotalDue { get; set; }
        public virtual DateTime? ActivationDate { get; set; }
        public virtual decimal Bucket1Due { get; set; }
        public virtual decimal Bucket2Due { get; set; }
        public virtual decimal Bucket3Due { get; set; }
        public virtual decimal Bucket4Due { get; set; }
        public virtual decimal Bucket5Due { get; set; }
        public virtual decimal Bucket6Due { get; set; }
        public virtual decimal Bucket7Due { get; set; }
        public virtual DateTime? LastPayDate { get; set; }
        public virtual DateTime? ExpirtyDate { get; set; }
        public virtual string CustStatus { get; set; }
        public virtual DateTime? AllocStartDate { get; set; }
        public virtual DateTime? AllocEndDate { get; set; }
        public virtual string GlobalCustId { get; set; }
        public virtual decimal CreditLimit { get; set; }
        public override DateTime FileDate { get; set; }
        public override ulong FileRowNo { get; set; }

        public virtual bool IsReferred { get; set; }
        public virtual uint Pincode { get; set; }
        public virtual ScbEnums.Products Product { get; set; }
        public virtual ColloSysEnums.AllocStatus AllocStatus { get; set; }
        public virtual ColloSysEnums.NoAllocResons? NoAllocResons { get; set; }
        public virtual GPincode GPincode { get; set; }
        public override FileScheduler FileScheduler { get; set; }
        #endregion

        #region Relationship

        public override IList<string> GetExcludeInExcelProperties()
        {
            var memberHelper = new MemberHelper<CWriteoff>();
            return new List<string>
                {
                    memberHelper.GetName(x => x.Id),
                    memberHelper.GetName(x => x.Version),
                    memberHelper.GetName(x => x.CreatedBy),
                    memberHelper.GetName(x => x.CreatedOn),
                    memberHelper.GetName(x => x.CreateAction),
                    memberHelper.GetName(x => x.IsReferred),
                    memberHelper.GetName(x => x.Pincode),
                    memberHelper.GetName(x => x.AllocStatus),
                    memberHelper.GetName(x => x.NoAllocResons),
                    memberHelper.GetName(x => x.FileScheduler),
                    memberHelper.GetName(x => x.GPincode),
                    memberHelper.GetName(x => x.Allocs),
                    memberHelper.GetName(x => x.Product)
                };
        }
        public virtual Iesi.Collections.Generic.ISet<Allocations> Allocs { get; set; }

        #endregion
    }
}


