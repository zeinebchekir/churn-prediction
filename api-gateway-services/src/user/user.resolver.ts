import { Metadata } from '@grpc/grpc-js';
import { Inject, OnModuleInit, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import { log } from 'console';
import { AuthGuard, ResourceGuard, RoleMatchingMode , Roles } from 'nest-keycloak-connect';
import { Observable } from 'rxjs';
import { createclientInput, createUserInput, deleteUser, deleteUserResponse, updateUser, User } from 'src/schemas/user.schema';
// Interface correspondant aux méthodes du service gRPC
interface UsersService {
    getUser(data: { id: string }): Observable<{ id: string; name: string }>;
  }
  
@Resolver(()=>"User")
export class UserResolver implements OnModuleInit {
  
    constructor(
        @Inject('USERS_SERVICE') private client:ClientGrpc,
        @Inject('AUTH_SERVICE') private authclient:ClientGrpc,
        @Inject('KAFKA_SERVICE') private kafkaclient:ClientKafka,


    ){}
    private usersService;
    private authService;

onModuleInit() {
   this.usersService=this.client.getService<UsersService>("UsersService");
   this.authService=this.authclient.getService("AuthService");
}


@Mutation(()=>User)
@UseGuards(AuthGuard, ResourceGuard)
@Roles({
  roles: ['admin', 'employee'],
})
async addClient(  @Args('params') params: createclientInput, @Context() context){
 
  const token = context.req.headers.authorization?.replace('Bearer ', '');  
  const user={...params,role:"client"}
  const responseUserService = await this.usersService.addClient(params).toPromise();
 // console.log('api gateway ',responseUserService);  
  const createonkeyckloak =await this.authService.addUser({ user:user, token }).toPromise();
  const response={
   // responseUserService,
    createonkeyckloak
  }
  console.log("biiiiiiiiiiiiig response",response);
  return responseUserService;
}

@Mutation(()=>User)
@UseGuards(AuthGuard, ResourceGuard)
@Roles({ roles: ['admin'] })
async addUser(@Args('params') params: createUserInput, @Context() context){
  const token = context.req.headers.authorization?.replace('Bearer ', '');
  const response = await this.usersService.addUser(params).toPromise();
    const user={
      ...params
    }
    console.log('params',params);
    
  const createonkeyckloak =await this.authService.addUser({ user:user, token }).toPromise();
  this.kafkaclient.emit("notification-topic",response);
  return response;
}



@Query(()=>[User])
@UseGuards(AuthGuard, ResourceGuard)
@Roles({ roles: ['admin'] })
async GetAllUsers(){
  
  const response = await this.usersService.getAllUsers({}).toPromise();
  console.log(response);
  console.log(response.users);
  
  
  return response.users;
}


@Mutation(()=>deleteUserResponse)
@UseGuards(AuthGuard, ResourceGuard)
@Roles({ roles: ['admin','employee'] })
async delete(@Args('params') params: deleteUser, @Context() context){
  const token = context.req.headers.authorization?.replace('Bearer ', '');
  const IDFROMKeyckloak=await this.authService.getUserByEmail({email:params.email,token}).toPromise();
  console.log("iiiiddd user ",IDFROMKeyckloak);
  
  console.log(IDFROMKeyckloak); 
  const responsekeyckloak =await this.authService.deleteUser({ id:IDFROMKeyckloak.id, token}).toPromise();
  const response = await this.usersService.deleteUser(params).toPromise();
  return responsekeyckloak;
}


















}
