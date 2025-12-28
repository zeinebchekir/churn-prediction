import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("KEYCLOAK_REALM:", process.env.KEYCLOAK_REALM);
console.log("KEYCLOAK_CLIENT_ID:", process.env.KEYCLOAK_CLIENT_FACING_CLIENT_ID);
console.log(process.env.KEYCLOAK_CLIENT_FACING_CLIENT_SECRET);

  await app.listen(3001);
}
bootstrap();
