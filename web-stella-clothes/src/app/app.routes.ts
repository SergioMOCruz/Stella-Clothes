import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { FourOFourComponent } from './views/four-o-four/four-o-four.component';
import { ProductPageComponent } from './feature/store/product-page/product-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'product/:ref', component: ProductPageComponent },
  { path: '404', component: FourOFourComponent },
  { path: '**', redirectTo: '/404' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
