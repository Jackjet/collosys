﻿#region references

using ColloSys.DataLayer.Billing;
using ColloSys.DataLayer.Enumerations;
using ColloSys.DataLayer.SessionMgr;
using ColloSys.QueryBuilder.BaseTypes;
using ColloSys.QueryBuilder.TransAttributes;
using NHibernate.Criterion;

#endregion


namespace ColloSys.QueryBuilder.BillingBuilder
{
    public class BillStatusBuilder : Repository<BillStatus>
    {
        public override QueryOver<BillStatus, BillStatus> ApplyRelations()
        {
            return QueryOver.Of<BillStatus>();
        }

        [Transaction]
        public BillStatus OnProductMonth(ScbEnums.Products products, uint month)
        {
            return SessionManager.GetCurrentSession()
                                 .QueryOver<BillStatus>()
                                 .Where(x => x.Products == products && x.BillMonth == month)
                                 .SingleOrDefault();
        }
    }
}