﻿#region references

using System.Collections.Generic;
using System.Web.Http;
using AngularUI.Generic.connection;

#endregion


namespace AngularUI.Developer.generatedb
{
    public class DbGenerationApiController : ApiController
    {
        [HttpGet]
        
        public void CreateDatabase()
        {
            CreateDb.CreateDatabse();

        }

        [HttpGet]
        public IEnumerable<string> GetSectionsNames()
        {
            var data = ConnectionStringMgr.GetSectionsNames();
            return data;
        }

        [HttpPost]
        public void EncryptData()
        {
            const string sectionName = "connectionStrings";
            Cryptography.EncryptConnString(sectionName);
        }

        [HttpPost]
        public void DecryptData()
        {
            const string sectionName = "connectionStrings";
            Cryptography.DecryptConnString(sectionName);
        }

        [HttpGet]
        public void EncryptSection(string sectionName)
        {
            Cryptography.EncryptConnString(sectionName);
        }

        [HttpGet]
        public void DecryptSection(string sectionName)
        {
            Cryptography.DecryptConnString(sectionName);
        }
    }
}






//[System.Web.Mvc.HttpPost]
//[UserActivity(Activity = ColloSysEnums.Activities.Development)]
//public CreateDb CreateDatabase()
//{
//    CreateDb.CreateDatabse();
//    return RedirectToAction("SignOut");
//}

