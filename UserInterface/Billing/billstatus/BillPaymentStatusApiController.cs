﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ColloSys.DataLayer.Domain;
using ColloSys.DataLayer.Enumerations;
using ColloSys.QueryBuilder.BillingBuilder;

namespace AngularUI.Billing.billstatus
{
    public class BillPaymentStatusApiController : ApiController
    {
        private static readonly  BillAmountBuilder BillAmountBuilder=new BillAmountBuilder();

        [HttpGet]
        public HttpResponseMessage GetBillAmountDetails(ScbEnums.Products products, uint billmonth)
        {
            var data = BillAmountBuilder.OnProductMonth(products, billmonth);
            return Request.CreateResponse(HttpStatusCode.OK, data);
        }

        [HttpPost]
        public HttpResponseMessage SaveBillStatus(BillAmount amount)
        {
            BillAmountBuilder.Save(amount);
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}