import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class GigDTO{
    id:string
    @IsNotEmpty({message:"Name must have a value"})
    @IsString({message:"Name must have a string"})
    @Matches(/^[A-Z][a-zA-Z ]+$/, {message:"Enter a proper name"})
    name:string

    @IsDate()
    @IsNotEmpty({message:"Start date is required"})
    startDate: Date

    @IsNotEmpty({message:"End date is required"})
    @IsDate()
    endDate: Date

    @IsNotEmpty({message:"Updater Name must have a value"})
    updatedBy:string
    image:string
    locationId:string
}

export class GigResgistrationDTO{
    @IsNotEmpty({message:"Name must have a value"})
    @IsString({message:"Name must have a string"})
    @Matches(/^[a-zA-Z]+$/, {message:"Enter a proper name"})
    name:string

    @IsDate()
    dateOfBirth: Date

    @IsNotEmpty({message:"Blood Group must have a value"})
    @Matches(/^(A|B|AB|O)[+-]$/, {message:"Enter a proper Blood Group"})
    bloodGroup: string

    @IsNotEmpty({message:"Password must have a value"})
    @Matches(/^(?=.*[@$&!_-])[A-Za-z0-9@$&!_-]{6,}$/, {message:"Enter a proper Password with length 6 with 1 special character from this set [@,$,&,!,_,-]"})
    password:string


    @IsNotEmpty({message:"User name must have a value"})
    @IsString({message:"User name must have a string"})
    @Matches(/^[a-zA-Z0-9]+$/, {message:"User name can contain only letters and numbers"})
    username:string

    @IsNotEmpty({message:"Usertype name must have a value"})
    userTypr:string

    @IsNotEmpty({message:"Email must have a value"})
    @IsEmail({},{message:"Give a proper email"})
    email:string

    @IsNotEmpty({message:"User name must have a value"})
    @IsString({message:"User name must have a string"})
    @Matches(/^01[7-9|36|4]\d{8}$/, {message:"User name can contain only letters and numbers"})
    phoneNumber:string

    locationId:string
}