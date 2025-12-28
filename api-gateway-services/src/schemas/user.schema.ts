import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { OutputTypeFactory } from "@nestjs/graphql/dist/schema-builder/factories/output-type.factory";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum Role{
    ADMIN="admin",
    CLIENT="client",
    EMPLOYEE="employee"
}
@Schema({
timestamps:true
})
@ObjectType()
export class User{
  
    @Field()
    _id:string
    @Field()
    numIdentite:number;
    @Field()
    nom :string;
    @Field()
    prenom :string;
    @Field()
    email :string;
    @Field()
    mdp :string;
    @Field()
    adresse :string;
    @Field()
    numTel :number;
    @Field()
    role:Role;
   
}
export const UserSchema=SchemaFactory.createForClass(User)

@InputType()
export class loginInput {
  
    @Field({ nullable: false })
    username?: string;
  
    @Field({ nullable: false })
    password?: string;
  
  }
  
  @InputType()
  export class createUserInput {
    @Field()
    numIdentite:number;
    @Field()
    nom :string;
    @Field()
    prenom :string;
    @Field()
    email :string;
    @Field()
    mdp :string;
    @Field()
    adresse :string;
    @Field()
    numTel :number;
    @Field()
    role:Role;
    @Field()
    partner:number;
    @Field()
    Dependents:number;
  }
  
  @InputType()
  export class createclientInput {
    @Field()
    numIdentite:number;
    @Field()
    nom :string;
    @Field()
    prenom :string;
    @Field()
    email :string;
    @Field()
    mdp :string;
    @Field()
    adresse :string;
    @Field()
    numTel :number;
    @Field()
    partner:number;
    @Field()
    Dependents:number;
  }

  @InputType()
  export class updateUser 
  {
    @Field()
    id:string
    @Field()
    numIdentite:number;
    @Field()
    nom :string;
    @Field()
    prenom :string;
    @Field()
    email :string;
    @Field()
    mdp :string;
    @Field()
    adresse :string;
    @Field()
    numTel :number;
    @Field()
    partner:number;
    @Field()
    Dependents:number;
  }
  @InputType()
  export class deleteUser 
  {
    @Field()
    email:string
  }
  @ObjectType()
  export class deleteUserResponse 
  {
    @Field()
    status:string
    @Field()
    message:string
  }
  @InputType()
  export class featuresPredUser 
  {
    @Field()
    partner:number;
    @Field()
    Dependents:number;
  }


  @ObjectType()
  export class LoginResponse {
    @Field()
    token: string;
  }

  

   

  