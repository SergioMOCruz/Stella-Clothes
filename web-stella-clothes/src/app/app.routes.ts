import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { FourOFourComponent } from './views/four-o-four/four-o-four.component';
import { LoginComponent } from './views/login/login.component';
import { ProfileNavbarComponent } from './views/profile-navbar/profile-navbar.component';
import { ChangeDataComponent } from './views/change-data/change-data.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { CartComponent } from './modules/cart/cart.component';


export const routes: Routes = [
  // In routes needing of Authentication add { ..., canActivate: [AuthGuard] }
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: '404', component: FourOFourComponent },
  { path: 'login', component: LoginComponent},
  { path: 'profile-navbar', component: ProfileNavbarComponent},
  { path: 'change-data', component: ChangeDataComponent},
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
