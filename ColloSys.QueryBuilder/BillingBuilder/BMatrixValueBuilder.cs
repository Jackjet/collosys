﻿#region references

using System;
using System.Collections.Generic;
using ColloSys.DataLayer.Billing;
using ColloSys.DataLayer.SessionMgr;
using ColloSys.QueryBuilder.BaseTypes;
using ColloSys.QueryBuilder.TransAttributes;
using NHibernate.Criterion;

#endregion


namespace ColloSys.QueryBuilder.BillingBuilder
{
    public class BMatrixValueBuilder : Repository<BMatrixValue>
    {
        public override QueryOver<BMatrixValue, BMatrixValue> ApplyRelations()
        {
            return QueryOver.Of<BMatrixValue>();
        }

        [Transaction]
        public IEnumerable<BMatrixValue> OnMatrixId(Guid matrixId)
        {
            return SessionManager.GetCurrentSession().QueryOver<BMatrixValue>()
                                 .Where(c => c.BMatrix.Id == matrixId)
                                 .List();
        }
    }
}