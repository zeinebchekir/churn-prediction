import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { PredictionModule } from './prediction/prediction.module';

@Module({
  imports: [
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
    GraphQLModule.forRoot({
      driver:ApolloDriver,
      playground:true,     
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    UserModule,
    AuthModule,
    HttpModule,
    ClientsModule.register([
      {
        name:"USERS_SERVICE",
        transport:Transport.GRPC,
        options:{
          package:"users",
          protoPath:join(__dirname,'..', 'src', 'protos', 'users.proto'),
          url:"localhost:50053"
        }
      }
    ]),
    ClientsModule.register([
      {
        name:"AUTH_SERVICE",
        transport:Transport.GRPC,
        options:{
          package:"auth",
          protoPath:join(__dirname,'..', 'src', 'protos', 'auth.proto'),
          url:"localhost:50052"
        }
      }
    ]),
    ConfigModule.forRoot({ 
      envFilePath:'.env',
      isGlobal: true }),
      KeycloakConnectModule.register({
        authServerUrl: process.env.KEYCLOAK_DOMAIN, // might be http://localhost:8080/auth for older keycloak versions
        realm: process.env.KEYCLOAK_REALM,
        clientId:process.env.KEYCLOAK_CLIENT_FACING_CLIENT_ID,
        secret: process.env.KEYCLOAK_CLIENT_FACING_CLIENT_SECRET ?? "FKJptWtEs9pFuoyQxOK3zMPqZha0j8lt",
      // optional
      }),
      PredictionModule,
  ],
  controllers: [AppController],
  providers: [AppService,
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
