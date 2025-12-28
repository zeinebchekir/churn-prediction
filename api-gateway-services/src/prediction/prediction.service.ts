import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PredictionService {
    constructor(private readonly httpService: HttpService) {}
    async predict(features: number[]) {
        const response = await firstValueFrom(
          this.httpService.post('http://localhost:5000/predict', {
            features: features,
          }),
        );
        return response.data;
      }
}
