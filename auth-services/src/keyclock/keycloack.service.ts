import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "src/schemas/user.schema";
import { CredentialRepresentation, UserRepresentation } from "./dto/user-representaion";
import { firstValueFrom } from "rxjs";
import { RoleRepresentation } from "./dto/role-representation";

@Injectable()
export class keycloackService{
    keycloakAdminUrl: string;
    keycloakLoginUrl: string ;
    clientId: string;
    clientSecret: string;
    lifespan: string;
    redirectUrl : string;
  
    constructor(
      private readonly httpService: HttpService,
      private readonly configService: ConfigService,
    ) {
      // Initialisation des propriétés avec des valeurs de config
      this.keycloakAdminUrl = this.configService.get<string>('keycloak_admin.baseURL')!;
      this.keycloakLoginUrl = this.configService.get<string>('keycloak.login_url')!;
      this.clientId = this.configService.get<string>('keycloak_admin.clientId')!;
      this.clientSecret = this.configService.get<string>('keycloak_admin.clientSecret')!;
      this.lifespan = this.configService.get<string>('keycloak_admin.linkLifeSpan')!;
      this.redirectUrl = this.configService.get<string>('keycloak_admin.clientRedirectUrl')!;
    }

    async createUser(newUser:User,token:string):Promise<string>{
      try{
        // const token=await this.getAdminToken();
     
        let user=new UserRepresentation();
        user.username=newUser.nom+newUser.prenom;
        user.firstName=newUser.nom;
        user.lastName=newUser.prenom;
        user.email=newUser.email;
        let credentials =new CredentialRepresentation();
        credentials.type="password";
        credentials.temporary=false;
        credentials.value=newUser.mdp;
        user.credentials=[credentials];
        user.enabled=true;
        user.emailVerified=false;
        console.log("user:",user)
        const response =await firstValueFrom(this.httpService.post(`${this.keycloakAdminUrl}/users`,user,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }))
        //console.log(response);
        
        const userId = response.headers['location']?.split('/').pop(); 
        console.log("IIIIIIIIIIIDDDDDDDDDDDDDDD",userId);
        
        return userId;
      }catch(error){
        console.error("❌ Erreur lors de la creation de l'utilisateur:", error.response?.data || error.message);
        console.error("🔎 Code d'erreur HTTP:", error.response?.status);
        console.error("📄 Détails de l'erreur:", JSON.stringify(error.response?.data, null, 2));
    
        throw new Error(`Failed to add user: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
      }
      
    }

  // async sendMailVerification(user: UserRepresentation,token:string) {
  //   let users =await this.getUserByUserName(user,token);
  //   let userId=users[0];
  //   try{
     
  //     let response= await firstValueFrom(this.httpService.get(`${this.keycloakAdminUrl}/users/${userId}/send-verify-email`,{
  //      headers:{
  //          Authorization:`Bearer ${token}`
  //      }
  //  }))
  //  return response.data;
  //  }catch(error){
  //    console.error("❌ Erreur lors de l'envoi de l'email de l'utilisateur:", error.response?.data || error.message);
  //    console.error("🔎 Code d'erreur HTTP:", error.response?.status);
  //    console.error("📄 Détails de l'erreur:", JSON.stringify(error.response?.data, null, 2));
 
  //    throw new Error(`Failed to send email user: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
  //  }

  // }


  async getUserByUserName(user: UserRepresentation, token: string):Promise<UserRepresentation[]> {
    const params=new URLSearchParams({
      first:'0',
      max:'1',
      exact:'true',
    });
    if(user.username){
      params.append("username",user.username);
    }
    try{
     
       let response= await firstValueFrom(this.httpService.get(`${this.keycloakAdminUrl}/users?${params.toString()}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    }))
    return response.data;
    }catch(error){
      console.error("❌ Erreur lors de la mise à jour de l'utilisateur:", error.response?.data || error.message);
      console.error("🔎 Code d'erreur HTTP:", error.response?.status);
      console.error("📄 Détails de l'erreur:", JSON.stringify(error.response?.data, null, 2));
  
      throw new Error(`Failed to update user: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
    }
  
  }
    // async getAdminToken() {
    //   console.log(this.keycloakLoginUrl);
    //   const formData = new URLSearchParams();
    //   formData.append('client_id', this.clientId);
    //   formData.append('client_secret', this.clientSecret);
    //   formData.append('grant_type', 'client_credentials');
    //   try {
    //     const response = await firstValueFrom(
    //       this.httpService.post(this.keycloakLoginUrl, formData.toString(), {
    //         headers: {
    //           'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //       }),
    //     );
    //     const { access_token } = response.data;
    //     return access_token;
    //   } catch (error) {
    //     throw new Error(`Client login failed: ${error.message}`);
    //   }
  
  
    // }


    async getUserByEmail(email:string, token: string): Promise<UserRepresentation[]> {
      const params = new URLSearchParams({
        first: '0',
        max: '1',
        exact: 'true',
      });
  
      if (email) {
        params.append('email', email);
      }
  
      try {
        const response = await firstValueFrom(
          this.httpService.get(`${this.keycloakAdminUrl}/users?${params.toString()}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        );
        // const userId = response.headers['location']?.split('/').pop(); 
        // return userId;
        console.log(response.data[0].id);
        
        return response.data[0].id;
      } catch (error) {
        console.error("❌ Erreur lors de la recherche de l'utilisateur par email:", error.response?.data || error.message);
        console.error("🔎 Code d'erreur HTTP:", error.response?.status);
        console.error("📄 Détails de l'erreur:", JSON.stringify(error.response?.data, null, 2));
  
        throw new Error(`Failed to get user by email: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
      }
    }

    async updateUser(newUser:User,userID:string,token:string):Promise<void>{
      try{
        // const token=await this.getAdminToken();
        let user=new UserRepresentation();
        user.id=userID;
        user.firstName=newUser.nom;
        user.lastName=newUser.prenom;
        user.email=newUser.email;
        let credentials =new CredentialRepresentation();
        credentials.type="password";
        credentials.temporary=false;
        credentials.value=newUser.mdp;
        user.credentials=[credentials];
        user.enabled=true;
        user.emailVerified=false;
      
        await firstValueFrom(this.httpService.put(`${this.keycloakAdminUrl}/users/${userID}`,user,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }))
        
      }catch(error){
        console.error("❌ Erreur lors de la mise à jour de l'utilisateur:", error.response?.data || error.message);
        console.error("🔎 Code d'erreur HTTP:", error.response?.status);
        console.error("📄 Détails de l'erreur:", JSON.stringify(error.response?.data, null, 2));
    
        throw new Error(`Failed to update user: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
      }
      
    }
    async deleteUser(userID:string,token:string):Promise<void>{
      try{
        // const token=await this.getAdminToken();
       
        console.log("url:"+`${this.keycloakAdminUrl}/users/${userID}`)
        await firstValueFrom(this.httpService.delete(`${this.keycloakAdminUrl}/users/${userID}`,{
            headers:{
                Authorization:`Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        }))
        
      }catch(error){
        console.error("❌ Erreur lors de la supprission de l'utilisateur:", error.response?.data || error.message);
        console.error("🔎 Code d'erreur HTTP:", error.response?.status);
        console.error("📄 Détails de l'erreur:", JSON.stringify(error.response?.data, null, 2));
    
        throw new Error(`Failed to delete user: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
      }
      
    }

    async getRoleByRoleName(clientUUID:string,roleName: string, token: string):Promise<RoleRepresentation[]> {
 // ID statique du client

  try {
    const roleRes = await firstValueFrom(
      this.httpService.get(
        `${this.keycloakAdminUrl}/clients/${clientUUID}/roles/${roleName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    );

    return roleRes.data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du rôle client:", error.response?.data || error.message);
    console.error("🔎 Code d'erreur HTTP:", error.response?.status);
    console.error("📄 Détails de l'erreur:", JSON.stringify(error.response?.data, null, 2));

    throw new Error(
      `Failed to get client role '${roleName}' for client UUID '${clientUUID}': ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
    );
  }



    }
    async assignmanageusersRole(userID: string, roleName: string, token: string): Promise<any> {
     const  clientuuid="b2ddbea5-29e3-45b1-a9e5-af39273894ba";
      // Récupérer les deux rôles
      const roles = await this.getRoleByRoleName(clientuuid,roleName, token);
      const realmMgmtRole=[roles]
          await firstValueFrom(
            this.httpService.post(
              `${this.keycloakAdminUrl}/users/${userID}/role-mappings/clients/${clientuuid}`,realmMgmtRole,{
              headers:{
                  Authorization:`Bearer ${token}`
              }
          })
          );
    
      return { message: "Rôles assignés avec succès" };
    }
    

    async assignUserRole(userID:string,roleName:string,token:string):Promise<any>{
      const clientuuid="6d370f31-5081-4dde-8eba-ca584989230e"
      // const token=await this.getAdminToken();
      console.log("service",userID);
      console.log("service",roleName);
      console.log("service",token);
      const role=await this.getRoleByRoleName(clientuuid,roleName,token);
      let roles=[role];
      console.log("serviiiiiiiiceroleees",roles);
      
     const response= await firstValueFrom(this.httpService.post(`${this.keycloakAdminUrl}/users/${userID}/role-mappings/clients/${clientuuid}`,roles,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    }))
    return response;
    }

    async loginUser(username: string, password: string) {
      const formData = new URLSearchParams();
      formData.append('client_id', 'auth-client');
      formData.append('client_secret', 'FKJptWtEs9pFuoyQxOK3zMPqZha0j8lt');
      formData.append('grant_type', 'password');
      formData.append('username', username);
      formData.append('password', password);
    
      try {
        const response = await firstValueFrom(
          this.httpService.post(
            this.keycloakLoginUrl,
            formData.toString(),
            {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
          )
        );
      
       return  response.data;
        // Retourne le token d'accès
      } catch (error) {
        console.error("❌ Erreur lors de login de l'utilisateur:", error.response?.data || error.message);
        console.error("🔎 Code d'erreur HTTP:", error.response?.status);
        console.error("📄 Détails de l'erreur:", JSON.stringify(error.response?.data, null, 2));
    
        throw new Error(`Failed to login user: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
      }      }
    }

  
    
  
