﻿using ColloSys.DataLayer.Domain;
using ColloSys.FileUploaderService.RowCounter;

namespace ColloSys.FileUploaderService.RecordManager
{
    public interface ITextRecord<TEntity> : IRecordCreator<TEntity> 
        where TEntity : class, new()
    {
        void Init(FileScheduler fileScheduler, ICounter counter);

        void InitPreviousDayLiner(FileScheduler fileScheduler);
    }
}