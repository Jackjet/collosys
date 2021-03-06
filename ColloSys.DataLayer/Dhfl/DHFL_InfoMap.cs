﻿using ColloSys.DataLayer.BaseEntity;

namespace ColloSys.DataLayer.Billing
{
    public class DHFL_InfoMap :EntityMap<DHFL_Info>
    {
        public DHFL_InfoMap()
        {
            Property(x=>x.ApplNo);
            Property(x=>x.AgentId);
            Property(x=>x.OriginMonth);
            Property(x=>x.SanctionAmt);
            Property(x=>x.TotalDisbAmt);
            Property(x=>x.TotalPayout);
            Property(x=>x.TotalProcFee);
            Property(x => x.TotalDeductCap);
        }
    }
}
