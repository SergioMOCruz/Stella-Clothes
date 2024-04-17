import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { FourOFourComponent } from './views/four-o-four/four-o-four.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { CartComponent } from './modules/cart/cart.component';
import { MyOrdersComponent } from './modules/my-orders/my-orders.component';


export const routes: Routes = [
  // In routes needing of Authentication add { ..., canActivate: [AuthGuard] }
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: '404', component: FourOFourComponent },
  { path: 'cart', component: CartComponent },
  { path: 'myorders', component: MyOrdersComponent },

  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
