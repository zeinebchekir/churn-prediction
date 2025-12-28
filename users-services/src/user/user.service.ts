import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
import * as  mongoose from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { status } from '@grpc/grpc-js'; 
@Injectable()
export class UserService {
    findAllClients() {
      throw new Error('Method not implemented.');
    }
    constructor(
        @InjectModel(User.name)
        private userModel:mongoose.Model<User>
    ){        
    }
    async findAll():Promise<User[]>{

        return await this.userModel.find();
    }
    async findByEmail(emaildata:string):Promise<User|null>{
        return await this.userModel.findOne({email:emaildata}).exec();
    }
    async createUser(userdata:User):Promise<User>{
        try{       
             const user= await this.userModel.create(userdata);     
            return user;      
        }
         catch(error){
             throw new BadRequestException("failed to create ")
         }      
    }
    async updateUser(userdata:User,identity:number):Promise<User|null>{
      try{  if(!await this.findByEmail(userdata.email) )
        throw new RpcException({ 
            code: status.NOT_FOUND, 
            message: "Utilisateur n'existe pas"
          });
        const user=await this.userModel.findByIdAndUpdate(identity,userdata)      
     return user;      
       }
     catch(error){
        throw new RpcException({ 
            code: status.INTERNAL, 
            message: "update failed"
          });
      }
       
    }
    async deleteUser(email:string):Promise<number>{
        try{
            const user=await this.userModel.findOneAndDelete({email:email});
            if(!user )
                throw new RpcException({ 
                    code: status.NOT_FOUND, 
                    message: "Utilisateur n'existe pas"
                  });
                  console.log(user.numIdentite)
            return user.numIdentite;        
        }
         catch(error){
            throw new RpcException({
                code: status.INTERNAL,
                message: "Échec de la suppression de l'utilisateur."
            });
         }
              
    }
    

}
