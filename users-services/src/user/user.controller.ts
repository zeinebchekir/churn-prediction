import { Controller, NotFoundException, UseGuards } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { UserService } from './user.service';
import { Role, User } from 'src/schemas/user.schema';
import { status } from '@grpc/grpc-js'; 
import { AuthGuard, ResourceGuard, Roles, Scopes } from 'nest-keycloak-connect';
import { CreateClient } from 'src/schemas/createclient.schema';
@Controller('user')
export class UserController {
    
    constructor(private userService :UserService){}

@GrpcMethod('UsersService', 'GetAllUsers')
async getAllUsers({}){
  const users = await this.userService.findAll();
console.log(users);
  return {users} }


  @GrpcMethod('UsersService', 'getAllClients')
async getAllClients(){
  const users = await this.userService.findAllClients();
console.log(users);
  return {users} }


  @GrpcMethod('UsersService', 'addUser')
  @Roles({roles:[Role.ADMIN]})
  async addUser(userData:User):Promise<User>{
    console.log("dddddddddddd");
    console.log(userData);
    if(await this.userService.findByEmail(userData.email) )
      throw new RpcException({ 
           code: status.ALREADY_EXISTS, 
           message: "Utilisateur existe deja"
         });
   const user= await this.userService.createUser(userData);
   
   const userCreated = {
    numIdentite: user.numIdentite,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    mdp: user.mdp,
    adresse: user.adresse,
    numTel: user.numTel,
    role: user.role,
    partner:user.partner,
    dependents:user.dependents
};
   return userCreated;
  }


  @GrpcMethod('UsersService', 'addClient')
  // @UseGuards(AuthGuard, ResourceGuard)
   @Roles({ roles: ['admin','employee'] })
  async addClient(userData:CreateClient):Promise<User>{
    if(await this.userService.findByEmail(userData.email) )
      throw new RpcException({ 
           code: status.ALREADY_EXISTS, 
           message: "Utilisateur existe deja"
         });
   const user= await this.userService.createUser({...userData,role:Role.CLIENT});
   
   const userCreated = {
    numIdentite: user.numIdentite,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    mdp: user.mdp,
    adresse: user.adresse,
    numTel: user.numTel,
    role: Role.CLIENT,
    partner:user.partner,
    dependents:user.dependents
};
   console.log(userCreated);
   
   return userCreated;
  }

  @GrpcMethod('UsersService', 'GetUser')
  @Roles({roles:[Role.EMPLOYEE,Role.EMPLOYEE]})
async GetUser(data: { email: string }){
  console.log("emaillll ldata",data.email);
  const user = await this.userService.findByEmail(data.email);
  console.log(user);
  if(!user)
    throw new RpcException({ 
      code: status.NOT_FOUND, 
      message: "Utilisateur non trouvé"
    });
   if(user)
  // Mappage des utilisateurs au format attendu par le message `GetAllUsersResponse`
  {
  return  user 
}
}
@GrpcMethod('UsersService', 'deleteUser')
@Roles({roles:[Role.EMPLOYEE,Role.ADMIN]})
async deleteUser(data: { email:string }){
  try {
    const numIdentite = await this.userService.deleteUser(data.email);
    return { numIdentite }; // Retourne l'identifiant de l'utilisateur supprimé
} catch (error) {
    throw error; // Renvoyer l'exception du service
}
}


}

  // Retourner un objet de type GetAllUsersResponse contenant la propriété `users`
 




