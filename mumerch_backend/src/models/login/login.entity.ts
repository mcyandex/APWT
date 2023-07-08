import { Collection, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { UserProfileEntity } from "../userProfile/userProfile.entity";
import { SizeEntity } from "../size/size.entity";
import { ColorEntity } from "../color/color.entity";
import { ProductEntity } from "../product/product.entity";
import { OrderEntity } from "../order/order.entity";
import { BandEntity } from "../band/band.entity";
import { BandManagerEntity } from "../bandManager/bandManager.entity";
import { CategoryEntity } from "../category/category.entity";
import { CustomerEntity } from "../customer/customer.entity";
import { DesignationEntity } from "../designation/designation.entity";
import { GigManagerEntity } from "../gigManager/gigManager.entity";

@Entity('Login')
export class LoginEntity {

  @PrimaryColumn()
  id: string;
  @Column()
  name:string
  @Column()
  password: string
  @Column()
  userType: string
  @Column()
  //@Column({unique:true})
  email: string
  @Column()
  //@Column({unique:true})
  phoneNumber: string
  @Column()
  designation: string
  @OneToOne(() => UserProfileEntity, user => user.login)
  user: UserProfileEntity;
  @OneToMany(()=>SizeEntity, sizes=>sizes.login)
  sizes:SizeEntity[]
  @OneToMany(()=>ColorEntity, colors=>colors.login)
  colors:ColorEntity[]
  @OneToMany(()=>ProductEntity, products=>products.login)
  products:ProductEntity[]
  @OneToMany(()=>OrderEntity, orders=>orders.login)
  orders:OrderEntity[]
  @OneToMany(()=>BandEntity, bands=>bands.login)
  bands:BandEntity[]
  @OneToMany(()=>BandManagerEntity, bandManagers=>bandManagers.login)
  bandManagers:BandManagerEntity[]
  @OneToMany(()=>GigManagerEntity, gigManagers=>gigManagers.login)
  gigManagers:GigManagerEntity[]
  @OneToMany(()=>CategoryEntity, catagories=>catagories.login)
  catagories:CategoryEntity[]
  @OneToMany(()=>CustomerEntity, customers=>customers.login)
  customers:CustomerEntity[]
  @OneToMany(()=>DesignationEntity, designations=>designations.login)
  designations:DesignationEntity[]
}