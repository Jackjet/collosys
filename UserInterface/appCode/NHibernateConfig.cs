﻿#region references

using ColloSys.DataLayer.Migrate;
using ColloSys.DataLayer.NhSetup;
using ColloSys.DataLayer.SessionMgr;
using ColloSys.Shared.ConfigSectionReader;

#endregion

namespace AngularUI.appCode
{
    public static class NHibernateConfig
    {
        public static void InitNHibernate()
        {
            var initNh = new NhInitParams
                {
                    ConnectionString = ColloSysParam.WebParams.ConnectionString,
                    DbType = ConfiguredDbTypes.MsSql,
                    IsWeb = true
                };

            SessionManager.InitNhibernate(initNh);

            HibernatingRhinos.Profiler.Appender.NHibernate.NHibernateProfiler.Initialize();

            NHibernate.Glimpse.Plugin.RegisterSessionFactory(SessionManager.GetSessionFactory());
        }

        public static void ApplyDatabaseChanges()
        {
            MigrateRunner.MigrateToLatest(ColloSysParam.WebParams.ConnectionString.ConnectionString);
        }
    }
}