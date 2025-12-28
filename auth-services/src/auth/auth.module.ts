import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthController } from './auth.controller';
import { keycloackService } from 'src/keyclock/keycloack.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports:[ConfigModule.forRoot({ 
          load:[configuration],
            envFilePath:'.env',
            isGlobal: true }),
        MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
        HttpModule,
      KeycloakConnectModule.register({
              authServerUrl: process.env.KEYCLOAK_DOMAIN, // might be http://localhost:8080/auth for older keycloak versions
              realm: process.env.KEYCLOAK_REALM,
              clientId:process.env.KEYCLOAK_CLIENT_FACING_CLIENT_ID,
              secret: process.env.KEYCLOAK_CLIENT_FACING_CLIENT_SECRET ??"FKJptWtEs9pFuoyQxOK3zMPqZha0j8lt",
            // optional
            }),],
controllers: [AuthController],
providers: [keycloackService,
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
]})
export class AuthModule {
    constructor(private configService: ConfigService) {
        const keycloakUrl = this.configService.get<string>('KEYCLOAK_LOGIN_URL');
        Logger.log(`🔹 KEYCLOAK_LOGIN_URL: ${keycloakUrl}`, 'AuthModule');
    }
}
