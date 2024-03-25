import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { FourOFourComponent } from './views/four-o-four/four-o-four.component';
import { SearchProductComponent } from './modules/search-product/search-product.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchProductComponent },
  { path: '404', component: FourOFourComponent },
  { path: '**', redirectTo: '/404' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
