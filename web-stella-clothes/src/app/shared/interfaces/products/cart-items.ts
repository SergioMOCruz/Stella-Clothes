import { Size } from "../../enum/size";

export interface CartItems {
  productReference: string,
  name: string,
  quantity: number,
  image: string,
  size: Size
}
