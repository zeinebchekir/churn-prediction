import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionResolver } from './prediction.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[HttpModule],
  providers: [PredictionService, PredictionResolver]
})
export class PredictionModule {}
