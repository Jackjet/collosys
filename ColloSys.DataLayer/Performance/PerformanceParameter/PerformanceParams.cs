﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ColloSys.DataLayer.BaseEntity;
using ColloSys.DataLayer.Enumerations;

namespace ColloSys.DataLayer.Performance.PerformanceParameter
{
   public class PerformanceParams:Entity
    {
       public virtual ColloSysEnums.PerformanceParam Param { get; set; }
       public virtual decimal Weightage { get; set; }
       public virtual ScbEnums.Products Products { get; set; }
       public virtual bool Ischeck { get; set; }
       public virtual ColloSysEnums.ParameterType ParameterType { get; set; }
       public virtual ColloSysEnums.TargetOn TargetOn { get; set; }
       public virtual ColloSysEnums.PolicyOn ParamsOn { get; set; }
       public virtual string ParamOnvalue { get; set; }
       public virtual DateTime StartDate { get; set; }
       public virtual DateTime EndDate { get; set; }
    }
}
