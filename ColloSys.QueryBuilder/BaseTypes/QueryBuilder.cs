﻿using System;
using System.Linq;
using System.Collections.Generic;
using System.Linq.Expressions;
using ColloSys.DataLayer.BaseEntity;
using ColloSys.DataLayer.Infra.SessionMgr;
using ColloSys.QueryBuilder.TransAttributes;
using NHibernate;
using NHibernate.Criterion;

namespace ColloSys.QueryBuilder.BaseTypes
{
    public abstract class QueryBuilder<T> : IQueryBuilder<T> where T : Entity, new()
    {
        [Transaction]
        public virtual IEnumerable<T> GetAll()
        {
            var session = SessionManager.GetCurrentSession();
            return session.QueryOver<T>().List<T>();
        }

        [Transaction]
        public virtual T GetWithId(Guid id)
        {
            var session = SessionManager.GetCurrentSession();
            return session.QueryOver<T>().Where(x => x.Id == id).SingleOrDefault<T>();
        }

        [Transaction]
        public virtual IList<T> GetOnExpression(Expression<Func<T, bool>> expression)
        {
            var session = SessionManager.GetCurrentSession();
            return session.QueryOver<T>().Where(expression).List();
        }

        [Transaction(Persist = true)]
        public virtual void Save(T obj)
        {
            var session = SessionManager.GetCurrentSession();
            session.Save(obj);
        }

        [Transaction]
        public virtual IEnumerable<T> ExecuteQuery(QueryOver<T> query)
        {
            var session = SessionManager.GetCurrentSession();
            return query.GetExecutableQueryOver(session).List<T>();
        }
        public abstract QueryOver<T,T> DefaultQuery();
        //public abstract IQueryOver<T> GetDefaultQuery { get; }
    }
}
