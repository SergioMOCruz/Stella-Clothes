import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { FourOFourComponent } from './views/four-o-four/four-o-four.component';
import { ProductPageComponent } from './modules/product-page/product-page.component';
import { CartComponent } from './modules/cart/cart.component';
import { MyOrdersComponent } from './modules/my-orders/my-orders.component';
import { ProductExistsGuard } from './guards/product-exists.guard';
import { CategoryComponent } from './modules/category/category.component';
import { CategoryExistsGuard } from './guards/category-exists.guard';
import { CheckoutComponent } from './modules/checkout/checkout.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'category/:description', component: CategoryComponent, canActivate: [CategoryExistsGuard] },
  { path: 'product/:reference', component: ProductPageComponent, canActivate: [ProductExistsGuard] },
  { path: '404', component: FourOFourComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
