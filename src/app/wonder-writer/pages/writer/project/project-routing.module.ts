import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectComponent} from './project.component';
import {DocumentComponent} from '@wonder-writer/components/project/document/document.component';

const routes: Routes = [
  {
    path: ':id',
    component: ProjectComponent,
    children: [
      {
        path: ':id',
        component: DocumentComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {
}
