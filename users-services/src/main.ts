import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthGuard } from 'nest-keycloak-connect';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("🚀 SERVICE_URI:", process.env.SERVICE_URI);
   app.connectMicroservice<MicroserviceOptions>({
      transport:Transport.GRPC,
      options:{
        package:"users",
        protoPath:join(__dirname,'..', 'src', 'protos', 'users.proto'),
        url:process.env.SERVICE_URI
      }
    })
    await app.startAllMicroservices();
    console.log("🚀 SERVICE_URI:", process.env.SERVICE_URI);
}
bootstrap();
