﻿using ColloSys.QueryBuilder.StakeholderBuilder;
using NUnit.Framework;
using System.Linq;

namespace ColloSys.QueryBuilder.Test.StakeBuilder.Test
{
    public class StakeBuilderTest
    {
        [Test]
        public void GetAllTest()
        {
            var stak = new StakeQueryBuilder();
            var data = stak.GetAll();
            Assert.AreEqual(1,1);
        }

        [Test]
        public void Check_DefaultQuery_And_ExecuteQuery()
        {
            var stakeQuery = new StakeQueryBuilder();
            var query = stakeQuery.ApplyRelations();
            var data = stakeQuery.Execute(query);

            var totalData = stakeQuery.GetAll();
            Assert.AreEqual(data.Count(),totalData.Count());
        }

        [Test]
        public void Check_asdk()
        {
            
        }
    }
}
