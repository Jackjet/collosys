﻿namespace ColloSys.FileUploaderService.AliasWriteOff.Rls
{
// ReSharper disable once InconsistentNaming
    public class RWriteOffPlAebRC:RWriteOffSharedRC
    {
        private const uint AccountPosition = 1;
        private const uint AccountLength = 11;
        private const uint CycleString = 5;
        public RWriteOffPlAebRC() : base(AccountPosition, AccountLength, CycleString)
        {
        }
    }
}
