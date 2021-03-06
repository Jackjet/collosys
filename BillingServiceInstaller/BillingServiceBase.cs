﻿#region references

using System;
using System.Configuration.Install;
using System.Globalization;
using System.Reflection;
using System.ServiceModel;
using System.ServiceProcess;
using System.Timers;
using ColloSys.BillingService.Logging;
using ColloSys.Shared.ConfigSectionReader;
using NLog;

#endregion

namespace ColloSys.BillingServiceInstaller
{
    public class BillingServiceBase : ServiceBase
    {
        #region ctor

        private readonly Logger _log = LogManager.GetCurrentClassLogger();
        public ServiceHost ServiceHost;

        private BillingServiceBase()
        {
            ServiceName = ProjectInstaller.AllocationServiceName;
            NLogConfig.InitConFig(ColloSysParam.WebParams.LogPath, ColloSysParam.WebParams.LogLevel);
        }

        #endregion

        #region main

        public static void Main(string[] args)
        {
            AppDomain.CurrentDomain.UnhandledException += CurrentDomainUnhandledException;
            CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
            CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;

            if (Environment.UserInteractive)
            {
                var parameter = string.Concat(args);
                switch (parameter)
                {
                    case "--install":
                        ManagedInstallerClass.InstallHelper(new[] { Assembly.GetExecutingAssembly().Location });
                        break;
                    case "--uninstall":
                        ManagedInstallerClass.InstallHelper(new[] { "/u", Assembly.GetExecutingAssembly().Location });
                        break;
                    default:
                        throw new InvalidOperationException(string.Format("The parameter:'{0}' is not supported", parameter));
                }
            }
            else
            {
                Run(new BillingServiceBase());
            }
        }

        private static void CurrentDomainUnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            //var logfile = ColloSysParam.WebParams.LogPath + @"\error.txt";
            //File.AppendAllText(logfile, ((Exception)e.ExceptionObject).Message + ((Exception)e.ExceptionObject).InnerException.Message);
            var log = LogManager.GetCurrentClassLogger();
            log.Error("Service: Unhandled Exception : " + e.ExceptionObject);
        }

        #endregion

        #region start

        private static Timer _aTimer;

        protected override void OnStart(string[] args)
        {
            base.OnStart(args);
            _aTimer = new Timer(10000);
            _aTimer.Elapsed += OnTimedEvent;
            _aTimer.Interval =  60 * 1000;
            _aTimer.Enabled = true;

            _log.Info("Service: Billing service started.");
        }

        private void OnTimedEvent(object source, ElapsedEventArgs e)
        {
            _log.Debug("Service: in timer event");
            IBillingStart allocationStart = new BillingStart();
            allocationStart.StartBillingProcess();
        }

        #endregion

        #region stop

        protected override void OnStop()
        {
            _log.Info("Service: Billing service is stopping.");
            if (ServiceHost == null) return;
            ServiceHost.Close();
            ServiceHost = null;
        }

        protected override void OnShutdown()
        {
            _log.Info("Service: Billing service is shutting down.");
            base.OnShutdown();
        }

        #endregion
    }
}
