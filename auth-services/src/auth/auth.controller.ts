import { Metadata } from '@grpc/grpc-js';
import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { log } from 'console';
import { access } from 'fs';
import { AuthenticatedUser, AuthGuard, Roles, Unprotected } from 'nest-keycloak-connect';
import { keycloackService } from 'src/keyclock/keycloack.service';
import { Role, User } from 'src/schemas/user.schema';

@Controller('auth')
export class AuthController {
  authService: any;

    constructor(private readonly keycloackService:keycloackService){}
    
  @GrpcMethod('AuthService', 'addUser')
  async addUser(data:{user:User ,token:string}):Promise<{ id: string }>{
   const {user,token}=data
  const response= await this.keycloackService.createUser(user,token);  
  const d ={
    id:response,
    role:user.role,
    tokenaccess:token
  }
   const role1 = await this.assignRole({id:response,role:user.role,token:token});
   if(user.role=="employee"){
    const role2 = await this.keycloackService.assignmanageusersRole(response,"manage-users",token);
    const role3 = await this.keycloackService.assignmanageusersRole(response,"view-clients",token);
    const role4 = await this.keycloackService.assignmanageusersRole(response,"manage-clients",token);
   }
   return {id:response};
  }

  @GrpcMethod('AuthService', 'updateUser')
  async updateUser(data: { id: string; user: User ,token:any}):Promise<void>{
    console.log("dddddddddddd");
    console.log(data);
    const {id,user,token}=data;
    console.log(id);
    console.log(user);
   await this.keycloackService.updateUser(user,id,token);
  }
  @GrpcMethod('AuthService', 'deleteUser')
  async deleteUser(data:{id:string,token:string}):Promise<{ status: string, message: string }>{
    console.log("deleeeeeeeeeeeeeeeeeete userrrrrrrrrr");
    
    const {id,token}=data;
   console.log("iddddddddddddddddddddddddddddddddddd",id);

   try {
    await this.keycloackService.deleteUser(id, token);
    return {
      status: "success",
      message: "Utilisateur supprimé avec succès."
    };
  } catch (error) {
    // Si une erreur se produit, on retourne un statut d'échec
    return {
      status: "failure",
      message: `Erreur lors de la suppression de l'utilisateur: ${error.message}`
    };
  }
  }
  
  @GrpcMethod('AuthService', 'assignRole')
  async assignRole(data: { id: string; role: string; token: string; }):Promise<any>{
    const {id,role,token}=data;
   console.log("assignrole",id);
   console.log("assignrole",role);
   console.log("assignrole",token);

   const res = await this.keycloackService.assignUserRole(id,role,token);
   return res;
  }


  @GrpcMethod('AuthService', 'login')
  @Unprotected()
  async login(data:{username:string,password:string,metadata:any}){ 
      const tokenData=await this.keycloackService.loginUser(data.username,data.password);
     
    const tok=tokenData.access_token;
   return {token:tok};
  }
  @GrpcMethod('AuthService', 'GetUserByEmail')
  async getUserByEmail(data: { email: string; token: string }) {
    const {email,token}=data;
    console.log(token);
    console.log(email);
    
    
    const result = await this.keycloackService.getUserByEmail(email,token);
    console.log("resultttttttttttt",result);
    
    return {id:result};
  }
}
