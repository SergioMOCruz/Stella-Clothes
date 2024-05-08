import { Size } from "../../enum/size";

export interface CartItems {
  clientId?: string,
  productReference: string,
  quantity: number,
  size: Size
}
