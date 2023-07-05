import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LoginEntity } from "../login/login.entity";

@Entity('Order')
export class OrderEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name:string
  @ManyToOne(()=>LoginEntity, login=>login.orders, {cascade:true})
  login:LoginEntity
}