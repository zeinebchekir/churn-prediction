import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class ChurnInput {
  @Field()
  tenure: number;

  @Field()
  PhoneService: number;

  @Field()
  MultipleLines: number;

  @Field()
  InternetService: number;

  @Field()
  OnlineSecurity: number;

  @Field()
  OnlineBackup: number;

  @Field()
  DeviceProtection: number;

  @Field()
  TechSupport: number;

  @Field()
  StreamingTV: number;

  @Field()
  StreamingMovies: number;

  @Field()
  Contract: number;

  @Field()
  PaperlessBilling: number;

  @Field()
  PaymentMethod: number;

  @Field()
  MonthlyCharges: number;

  @Field()
  TotalCharges: number;
}
@ObjectType()
export class PredictionValue{
    @Field()
    prediction:number;
}