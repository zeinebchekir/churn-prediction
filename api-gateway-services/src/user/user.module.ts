import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
         
        }
      },
    ]),
    ConfigModule.forRoot({ 
      envFilePath:'.env',
      isGlobal: true }),
    KeycloakConnectModule,
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '..', '..', 'src', 'protos', 'auth.proto'),
          url: 'localhost:50052',
        },
      },
      {
        name: 'USERS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'users',
          protoPath: join(__dirname, '..', '..', 'src', 'protos', 'users.proto'),
          url: 'localhost:50053',
        },
      },
    ]),
    (() => {
      console.log('✅ Loaded Keycloak Config:');
      console.log('KEYCLOAK_DOMAIN:', process.env.KEYCLOAK_DOMAIN);
      console.log('KEYCLOAK_REALM:', process.env.KEYCLOAK_REALM);
      console.log('KEYCLOAK_CLIENT_ID:', process.env.KEYCLOAK_CLIENT_FACING_CLIENT_ID);
      console.log('SECRET',process.env.KEYCLOAK_CLIENT_FACING_CLIENT_SECRET);
      
      return KeycloakConnectModule.register({
        authServerUrl: process.env.KEYCLOAK_DOMAIN,
        realm: process.env.KEYCLOAK_REALM,
        clientId: process.env.KEYCLOAK_CLIENT_FACING_CLIENT_ID,
        secret: process.env.KEYCLOAK_CLIENT_FACING_CLIENT_SECRET ?? "defaultSecret",
      });
    })(),
  ],
  providers: [UserResolver,
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
