import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ColorEntity } from "../color/color.entity";
import { ProductEntity } from "../product/product.entity";

@Entity('ProductColorMap')
export class ProductColorMapEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(()=>ColorEntity, color=>color.productColorMaps, {cascade:true})
  color:ColorEntity
  @ManyToOne(()=>ProductEntity, product=>product.productColorMaps, {cascade:true})
  product:ProductEntity
}