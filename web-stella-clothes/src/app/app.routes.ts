import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { FourOFourComponent } from './views/four-o-four/four-o-four.component';
import { ProductPageComponent } from './modules/product-page/product-page.component';
import { CartComponent } from './modules/cart/cart.component';
import { ProductExistsGuard } from './guards/product-exists.guard';
import { AuthGuard } from './auth/guards/auth.guard';


export const routes: Routes = [
  // In routes needing of Authentication add { ..., canActivate: [AuthGuard] }
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'product/:ref', component: ProductPageComponent, canActivate: [ProductExistsGuard] },
  { path: 'cart', component: CartComponent },
  { path: '404', component: FourOFourComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
