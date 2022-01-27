import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing',
  },
  {
    path: 'landing',
    loadChildren: () => import('./wonder-writer/pages/landing/landing.module').then(m => m.LandingModule),
  },
  {
    path: 'writer',
    loadChildren: () => import('./wonder-writer/pages/writer/writer.module').then(m => m.WriterModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
