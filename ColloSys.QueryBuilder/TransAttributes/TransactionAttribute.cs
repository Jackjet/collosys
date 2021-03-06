﻿using System;
using ColloSys.DataLayer.SessionMgr;
using NHibernate;
using PostSharp.Aspects;

namespace ColloSys.QueryBuilder.TransAttributes
{
    [Serializable]
    public class TransactionAttribute : OnMethodBoundaryAspect
    {
        public bool Persist { get; set; }
        private ITransaction transaction;
        private ISession Session;

        public TransactionAttribute()
        {
            Persist = false;

        }

        public override void OnEntry(MethodExecutionArgs args)
        {
            Session = SessionManager.GetCurrentSession();
            transaction = Session.BeginTransaction();
        }

        public override void OnExit(MethodExecutionArgs args)
        {
            if (transaction == null || !transaction.IsActive) return;
            if (Persist)
            {
                transaction.Commit();
            }
            else
            {
                transaction.Rollback();
            }
            if (Session.IsOpen)
            {
                Session.Clear();
            }
        }
    }
}