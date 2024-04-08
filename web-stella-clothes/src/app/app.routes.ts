import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { FourOFourComponent } from './views/four-o-four/four-o-four.component';
import { LoginComponent } from './views/login/login.component';
import { ProfileNavbarComponent } from './views/profile-navbar/profile-navbar.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '404', component: FourOFourComponent },
  { path: 'login', component: LoginComponent},
  { path: 'profile-navbar', component: ProfileNavbarComponent},
  { path: '**', redirectTo: '/404' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
