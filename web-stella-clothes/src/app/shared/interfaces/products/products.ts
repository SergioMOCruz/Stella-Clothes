export interface Product {
  ref: string,
  name: string,
  category: string,
  description: string,
  price: number,
  quantity?: number,
  size: string,
  stock: number,
  image: string
}
