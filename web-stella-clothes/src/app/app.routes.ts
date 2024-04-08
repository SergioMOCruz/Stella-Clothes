import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { FourOFourComponent } from './views/four-o-four/four-o-four.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  // In routes needing of Authentication add { ..., canActivate: [AuthGuard] }
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: '404', component: FourOFourComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
