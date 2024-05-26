import { Size } from "../../enum/size";

export interface Product {
  reference: string,
  name: string,
  category: string,
  description: string,
  price: number,
  size: Size,
  stock: number,
  image: string
}
