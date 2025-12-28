import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports:[MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),HttpModule,
  KeycloakConnectModule.register({
    authServerUrl: process.env.SERVICE_URI, // might be http://localhost:8080/auth for older keycloak versions
    realm: process.env.KEYCLOAK_REALM,
    clientId:process.env.KEYCLOAK_CLIENT_FACING_CLIENT_ID,
    secret: process.env.KEYCLOAK_CLIENT_FACING_CLIENT_SECRET ?? "FKJptWtEs9pFuoyQxOK3zMPqZha0j8lt",
  // optional
  }),
],
  controllers: [UserController],
  providers: [UserService,
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
  ]
})
export class UserModule {}
