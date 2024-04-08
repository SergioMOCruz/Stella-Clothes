import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor() {}

  getProducts() {
    return [
      {
        name: 'Product 1',
        quantity: 1,
        price: 10,
        image: 'https://images.unsplash.com/photo-1598190185341-a77898d61bc5?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        name: 'Product 2',
        quantity: 2,
        price: 20,
        image: 'https://images.unsplash.com/photo-1604733306415-c84fba185f31?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2xvdGluZ3xlbnwwfHwwfHx8MA%3D%3D',
      },
    ];
  }
}
