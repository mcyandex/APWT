import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LoginEntity } from "../login/login.entity";
import { BandEntity } from "../band/band.entity";

@Entity('BandManager')
export class BandManagerEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(()=>LoginEntity, login=>login.bandManagers, {cascade:true})
  login:LoginEntity
  @OneToOne(()=>BandEntity, bands=>bands.bandManager, {cascade:true})
  @JoinColumn()
  band:BandEntity
}