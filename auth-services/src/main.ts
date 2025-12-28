import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as dotenv from 'dotenv';
async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport:Transport.GRPC,
    options:{
      package:"auth",
      protoPath:join(__dirname,'..', 'src', 'protos', 'auth.proto'),
      url:process.env.SERVICE_URI
    }
  })
  await app.startAllMicroservices();
}
bootstrap();
