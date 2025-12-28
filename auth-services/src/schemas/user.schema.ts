import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum Role{
    ADMIN="admin",
    CLIENT="client",
    EMPLOYEE="employee"
}
@Schema({
timestamps:true
})
export class User{

    @Prop()
    numIdentite:number;
    @Prop()
    nom :string;
    @Prop()
    prenom :string;
    @Prop()
    email :string;
    @Prop()
    mdp :string;
    @Prop()
    adresse :string;
    @Prop()
    numTel :number;
    @Prop()
    role:Role;
    @Prop()
    partner:number;
    @Prop()
    dependents:number;

    
}
export const UserSchema=SchemaFactory.createForClass(User)