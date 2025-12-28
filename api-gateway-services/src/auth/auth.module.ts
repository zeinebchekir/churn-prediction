import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports:[
    ClientsModule.register([
      {
        name:"AUTH_SERVICE",
        transport:Transport.GRPC,
        options:{
          package:"auth",
          protoPath:join(__dirname,'..','..', 'src', 'protos', 'auth.proto'),
          url:"localhost:50052"
        }
      }
    ]),
  ],
  
  providers: [AuthResolver]
})
export class AuthModule {}
