import { ProductDTO } from "../product/product.dto";
import { SizeDTO } from "../size/size.dto";

export class ProductSizeMapDTO{
    id: string
    size:SizeDTO
    product:ProductDTO
}