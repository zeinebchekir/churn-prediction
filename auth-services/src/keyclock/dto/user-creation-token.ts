

export enum Role{
    ADMIN="admin",
    CLIENT="client",
    EMPLOYEE="employe"
}

export class UserCreationWithToken{

    numIdentite:number;
    nom :string;
    prenom :string;
    email :string;
    mdp :string;
    adresse :string;
    numTel :number;
    role:Role;
    partner:number;
    dependents:number;
    token:string;

    
}