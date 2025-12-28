import { OnModuleInit } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ChurnInput, PredictionValue } from 'src/schemas/contratPrediction.schema';
import { PredictionService } from './prediction.service';
import { featuresPredUser } from 'src/schemas/user.schema';

@Resolver()
export class PredictionResolver  {

    constructor(private readonly flaskService: PredictionService) {}
  

    @Mutation(() => PredictionValue)
    async predictChurn(@Args('contratInput') churninput:ChurnInput,@Args('userInput') userInput:featuresPredUser ) {
        const features=[...Object.values(userInput),...Object.values(churninput)]    
      const result = await this.flaskService.predict(features);
      console.log(result);

      return result;
    }
}
