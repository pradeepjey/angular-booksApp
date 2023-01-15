import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FavouritesComponent } from './components/favourites/favourites.component';

const routes: Routes = [ 
  {
    path: "",
    component: DashboardComponent
  },
  {
    path: "favourites",
    component: FavouritesComponent
  },
  {
    path: "details/:id",
    component: BookDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
