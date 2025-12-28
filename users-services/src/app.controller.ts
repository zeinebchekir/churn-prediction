import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { User } from './schemas/user.schema';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
   


  // @GrpcMethod('UsersService', 'GetAllUsers')
  // getAllUsers(data: any){
  //   return "{ users: [{ id: 1, nom: 'John', prenom: 'Doe', email: 'john.doe@example.com' }] }";
  // }
  // @GrpcMethod('UsersService', 'addUser')
  // addUser(data: any){

  //   return "{ users: [{ id: 1, nom: 'John', prenom: 'Doe', email: 'john.doe@example.com' }] }";
  // }
  //  @GrpcMethod('UsersService', 'addUser')
  //   async addUser(userData:User):Promise<User>{
      
  //     return await this.userService.createUser(userData);
  //   }

}
