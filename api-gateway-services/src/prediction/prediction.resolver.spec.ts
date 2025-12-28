import { Test, TestingModule } from '@nestjs/testing';
import { PredictionResolver } from './prediction.resolver';

describe('PredictionResolver', () => {
  let resolver: PredictionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PredictionResolver],
    }).compile();

    resolver = module.get<PredictionResolver>(PredictionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
