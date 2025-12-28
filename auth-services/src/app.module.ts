import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { keycloackService } from './keyclock/keycloack.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [ ConfigModule.forRoot({ 
        envFilePath:'.env',
        isGlobal: true }),
        KeycloakConnectModule.register({
          authServerUrl: process.env.SERVICE_URI, // might be http://localhost:8080/auth for older keycloak versions
          realm: process.env.KEYCLOAK_REALM,
          clientId:process.env.KEYCLOAK_CLIENT_FACING_CLIENT_ID,
          secret: process.env.KEYCLOAK_CLIENT_FACING_CLIENT_SECRET ??"FKJptWtEs9pFuoyQxOK3zMPqZha0j8lt",
        // optional
        }),
      MongooseModule.forRoot(process.env.MONGO_URI!),
      HttpModule,
      AuthModule],
  controllers: [AppController],
  providers: [AppService,keycloackService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
