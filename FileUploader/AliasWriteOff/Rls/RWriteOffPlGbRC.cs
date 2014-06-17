﻿namespace ColloSys.FileUploaderService.AliasWriteOff.Rls
{
// ReSharper disable once InconsistentNaming
    public class RWriteOffPlGbRC:RWriteOffSharedRC
    {
        private const uint AccountPosition = 1;
        private const uint AccountLength = 11;
        private const uint CycleString = 4;
        public RWriteOffPlGbRC() : base(AccountPosition, AccountLength, CycleString)
        {
        }
    }
}
