﻿#region references

using System.Collections.Generic;
using System.Linq;
using ColloSys.DataLayer.Domain;
using ColloSys.DataLayer.Infra.SessionMgr;
using ColloSys.QueryBuilder.BaseTypes;
using ColloSys.QueryBuilder.TransAttributes;
using NHibernate.Criterion;
using NHibernate.Linq;

#endregion


namespace ColloSys.QueryBuilder.GenericBuilder
{
    public class GPincodeBuilder : QueryBuilder<GPincode>
    {
        public override QueryOver<GPincode, GPincode> DefaultQuery()
        {
            return QueryOver.Of<GPincode>();
        }

        [Transaction]
        public IEnumerable<string> StateList()
        {
            return SessionManager.GetCurrentSession().Query<GPincode>()
                                 .Select(x => x.State)
                                 .Distinct().ToList();
        }

        [Transaction]
        public GPincode OnState(string state)
        {
            return SessionManager.GetCurrentSession()
                                 .Query<GPincode>()
                                 .First(x => x.State == state);
        }

        [Transaction]
        public List<IGrouping<string, GPincode>> OnCluster(string cluster)
        {
            return SessionManager.GetCurrentSession().Query<GPincode>()
                                 .Where(x => x.Cluster.StartsWith(cluster))
                                 .GroupBy(x => x.Cluster)
                                 .ToList();
        }

        [Transaction]
        public IEnumerable<GPincode> OnPinOrCity(string value)
        {
            return SessionManager.GetCurrentSession().Query<GPincode>()
                                 .Where(x => x.Pincode.ToString().StartsWith(value) || x.City.StartsWith(value))
                                 .Take(100)
                                 .ToList();
        }

        [Transaction]
        public IEnumerable<GPincode> OnPinOrArea(string value)
        {
            return SessionManager.GetCurrentSession().Query<GPincode>()
                                 .Where(x => x.Pincode.ToString().StartsWith(value) || x.Area.StartsWith(value))
                                 .Select(x => x)
                                 .Take(100).ToList();
        }

        [Transaction]
        public string RegionOnState(string state)
        {
            return SessionManager.GetCurrentSession().Query<GPincode>()
                                 .Where(x => x.State == state)
                                 .Select(x => x.Region)
                                 .Distinct()
                                 .FirstOrDefault();
        }
    }
}