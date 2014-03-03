﻿#region references

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using ColloSys.DataLayer.Allocation;
using ColloSys.DataLayer.Components;
using ColloSys.DataLayer.Domain;
using ColloSys.DataLayer.Enumerations;
using ColloSys.DataLayer.Infra.SessionMgr;
using ColloSys.DataLayer.SharedDomain;
using NHibernate;
using NHibernate.Criterion;
using NHibernate.Linq;
using NHibernate.SqlCommand;
using NHibernate.Transform;

#endregion

namespace ColloSys.UserInterface.Areas.Allocation.ViewModels
{
    public class AllocationChange
    {
        public AllocationChange()
        {
            ReleatedStakes=new List<Stakeholders>();
        }

        public Alloc Alloc { get; set; }
        public Info Liner { get; set; }
        public IDelinquentCustomer Writeoff { get; set; }
        public Stakeholders Stakeholder { get; set; }
        public List<Stakeholders> ReleatedStakes { get; set; }
        public string NewStakeholderId { get; set; }

        public List<AllocationChange> GetAllocations(DataModel2 model)
        {
            var obj = new List<AllocationChange>();
            switch (model.Product)
            {
                case ScbEnums.Products.SME_BIL:
                case ScbEnums.Products.SME_ME:
                case ScbEnums.Products.SME_LAP:
                case ScbEnums.Products.MORT:
                case ScbEnums.Products.AUTO:
                case ScbEnums.Products.PL:
                     obj = ConvertRAlloc(AllocationsListRAlloc(model));
                    break;

                case ScbEnums.Products.SME_LAP_OD:
                case ScbEnums.Products.AUTO_OD:
                case ScbEnums.Products.SMC:
                    obj = ConvertEAlloc(AllocationsListEAlloc(model));
                    break;

                case ScbEnums.Products.CC:
                    obj = ConvertCAlloc(AllocationsListCAlloc(model));
                    break;

                default:
                    throw new ArgumentOutOfRangeException();
            }
            return obj;
        }

        private IList AllocationsListEAlloc(DataModel2 model)
        {
            ICriteria criteria = null;
            using (var session = SessionManager.GetNewSession())
            {
                using (var trans = session.BeginTransaction())
                {
                    criteria = session.CreateCriteria<Alloc>("Alloc")
                                      .SetFetchMode("Stakeholder", FetchMode.Eager);

                    criteria.Add(Restrictions.Eq("Alloc.Status", ColloSysEnums.ApproveStatus.NotApplicable));

                    if (model.Category == ScbEnums.Category.Liner)
                    {
                        criteria.CreateCriteria("ELiner", "EObj", JoinType.InnerJoin)
                                .Add(Restrictions.Eq("EObj.Product", model.Product));
                    }

                    else
                    {
                        criteria.CreateCriteria("EWriteoff", "EObj", JoinType.InnerJoin).Add(Restrictions.Eq("EObj.Product", model.Product));
                    }

                    criteria.Add(Restrictions.Eq("EObj.AllocStatus", ColloSysEnums.AllocStatus.AllocateToStakeholder));


                    //criteria.Add(Restrictions.Gt("Alloc.CreatedOn", model.AllocDate))
                    //        .Add(Restrictions.Lt("Alloc.CreatedOn", model.AllocDate.AddDays(1).AddSeconds(-1)));

                    var list = criteria.SetResultTransformer(new DistinctRootEntityResultTransformer()).List();

                    trans.Rollback();

                    return list;
                }
            }
        }

        private IList AllocationsListRAlloc(DataModel2 model)
        {
            ICriteria criteria = null;
            using (var session = SessionManager.GetNewSession())
            {
                using (var trans = session.BeginTransaction())
                {
                    criteria = session.CreateCriteria<Alloc>("Alloc")
                                      .SetFetchMode("Stakeholder", FetchMode.Eager);

                    criteria.Add(Restrictions.Eq("Alloc.Status", ColloSysEnums.ApproveStatus.NotApplicable));

                    if (model.Category == ScbEnums.Category.Liner)
                    {
                        criteria.CreateCriteria("RLiner", "EObj", JoinType.InnerJoin)
                                .Add(Restrictions.Eq("EObj.Product", model.Product));
                    }

                    else
                    {
                        criteria.CreateCriteria("RWriteoff", "EObj", JoinType.InnerJoin).Add(Restrictions.Eq("EObj.Product", model.Product));
                    }

                    criteria.Add(Restrictions.Eq("EObj.AllocStatus", ColloSysEnums.AllocStatus.AllocateToStakeholder));


                    //criteria.Add(Restrictions.Gt("Alloc.CreatedOn", model.AllocDate))
                    //        .Add(Restrictions.Lt("Alloc.CreatedOn", model.AllocDate.AddDays(1).AddSeconds(-1)));

                    var list = criteria.SetResultTransformer(new DistinctRootEntityResultTransformer()).List();

                    trans.Rollback();

                    return list;
                }
            }
        }

        private IList AllocationsListCAlloc(DataModel2 model)
        {
            ICriteria criteria = null;
            using (var session = SessionManager.GetNewSession())
            {
                using (var trans = session.BeginTransaction())
                {
                    criteria = session.CreateCriteria<Alloc>("Alloc")
                                      .SetFetchMode("Stakeholder", FetchMode.Eager);

                    criteria.Add(Restrictions.Eq("Alloc.Status", ColloSysEnums.ApproveStatus.NotApplicable));

                    if (model.Category == ScbEnums.Category.Liner)
                    {
                        criteria.CreateCriteria("CLiner", "EObj", JoinType.InnerJoin)
                                .Add(Restrictions.Eq("EObj.Product", model.Product));
                    }

                    else
                    {
                        criteria.CreateCriteria("CWriteoff", "EObj", JoinType.InnerJoin).Add(Restrictions.Eq("EObj.Product", model.Product));
                    }

                    criteria.Add(Restrictions.Eq("EObj.AllocStatus", ColloSysEnums.AllocStatus.AllocateToStakeholder));


                    //criteria.Add(Restrictions.Gt("Alloc.CreatedOn", model.AllocDate))
                    //        .Add(Restrictions.Lt("Alloc.CreatedOn", model.AllocDate.AddDays(1).AddSeconds(-1)));

                    var list = criteria.SetResultTransformer(new DistinctRootEntityResultTransformer()).List();

                    trans.Rollback();

                    return list;
                }
            }
        }

        private List<AllocationChange> ConvertEAlloc(IList list)
        {
            var list2 = new List<AllocationChange>();

            foreach (var sharedAlloc in list)
            {
                var temp = new AllocationChange();
                temp.Alloc = (Alloc)sharedAlloc;
                temp.Stakeholder = DeepClone(((Alloc)sharedAlloc).Stakeholder);
                temp.Liner = DeepClone(((Alloc)sharedAlloc).Info);
                //temp.Writeoff = DeepClone(((Alloc)sharedAlloc).EWriteoff);

                //get related stakeholders
                if(temp.Liner!=null)
                    temp.ReleatedStakes.AddRange(GetStakeholders(temp.Liner.Pincode));
                else
                {
                    temp.ReleatedStakes.AddRange(GetStakeholders(temp.Writeoff.Pincode));
                }

                list2.Add(temp);
            }
            return list2;
        }

        private List<AllocationChange> ConvertRAlloc(IList list)
        {
            var list2 = new List<AllocationChange>();

            foreach (var sharedAlloc in list)
            {
                var temp = new AllocationChange();
                temp.Alloc = (Alloc)sharedAlloc;
                temp.Stakeholder = ((Alloc)sharedAlloc).Stakeholder;
                temp.Liner = DeepClone(((Alloc)sharedAlloc).Info);
                //temp.Writeoff = DeepClone(((RAlloc)sharedAlloc).RWriteoff);

                //get related stakeholders
                if (temp.Liner != null)
                    temp.ReleatedStakes.AddRange(GetStakeholders(temp.Liner.Pincode));
                else
                {
                    temp.ReleatedStakes.AddRange(GetStakeholders(temp.Writeoff.Pincode));
                }

                list2.Add(temp);
            }

            

            return list2;
        }

        private List<AllocationChange> ConvertCAlloc(IList list)
        {
            var list2 = new List<AllocationChange>();

            foreach (var sharedAlloc in list)
            {
                var temp = new AllocationChange();
                temp.Alloc = (Alloc)sharedAlloc;
                temp.Stakeholder =((Alloc)sharedAlloc).Stakeholder;
                temp.Liner = DeepClone(((Alloc)sharedAlloc).Info);
               // temp.Writeoff = DeepClone(((CAlloc)sharedAlloc).CWriteoff);
                list2.Add(temp);
            }
            return list2;
        }

        private IList<Stakeholders> GetStakeholders(uint pincode)
        {
            using (var session = SessionManager.GetNewSession())
            {
                using (var trans = session.BeginTransaction())
                {
                    //var data = session.Query<Stakeholders>()
                    //                  .Fetch(x => x.HierarchyObj)
                    //                  .FetchMany(x => x.StkhWorkings)
                    //                  .ThenFetch(x => x.GPincode)
                    //                  .Where(x=>x.HierarchyObj.IsInAllocation)
                    //                  .ToList();
                    Stakeholders stake = null;
                    StkhWorking work = null;
                    StkhHierarchy hierarchy = null;
                    var data = session.QueryOver<Stakeholders>(() => stake)
                        //.Fetch(x => x.StkhWorkings).Eager
                                      .Fetch(x => x.Hierarchy).Eager
                        //.JoinAlias(() => stake.StkhWorkings, () => work, JoinType.InnerJoin)
                                      .JoinAlias(() => stake.Hierarchy, () => hierarchy, JoinType.InnerJoin)
                                      .Where(() => hierarchy.IsInAllocation)
                                      .List();
                    trans.Rollback();
                    return data;
                }
            }
        }

        private static T DeepClone<T>(T obj)
        {
            if (obj == null)
            {
                return Activator.CreateInstance<T>();
            }
            var newPerson = Activator.CreateInstance<T>();
            var fields = newPerson.GetType().GetProperties();
            foreach (var field in fields)
            {
                var value = field.GetValue(obj);
                field.SetValue(newPerson, value);
            }
            return newPerson;
        }
    }

    public class ChangeAllocationModel
    {
        public ChangeAllocationModel()
        {
            list=new List<AllocationChange>();
            Model2=new DataModel2();
        }

        public List<AllocationChange> list { get; set; }
        public DataModel2 Model2 { get; set; }
    }
}