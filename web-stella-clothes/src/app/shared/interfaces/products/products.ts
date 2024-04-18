import { Size } from "../../enum/size";

export interface Product {
  ref: string,
  name: string,
  category: string,
  description: string,
  price: number,
  quantity?: number,
  size: Size,
  stock: number,
  image: string
}
