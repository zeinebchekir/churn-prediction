import { Inject, OnModuleInit } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard, Public, Unprotected } from 'nest-keycloak-connect';
import {
    
    createUserInput,
    deleteUser,
    updateUser,
    loginInput,
    LoginResponse
  } from 'src/schemas/user.schema';
@Resolver()
export class AuthResolver implements OnModuleInit {
  private authService;

    constructor(
        @Inject('AUTH_SERVICE') private client:ClientGrpc
    ){}

onModuleInit() {
   this.authService=this.client.getService("AuthService");
}


@Mutation(() => LoginResponse)
@Unprotected()
@Public()
  async login(
    @Args('params') params: loginInput,
  ) {
    const response = await this.authService.login(params).toPromise();
    return response; 
  }

  

  

  
}
