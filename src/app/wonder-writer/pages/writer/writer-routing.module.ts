import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WriterComponent} from './writer.component';

const routes: Routes = [
  {
    path: '',
    component: WriterComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'projects',
      },
      {
        path: 'projects',
        loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
      },
      {
        path: 'project/:id/settings',
        loadChildren: () => import('./project-settings/project-settings.module').then(m => m.ProjectSettingsModule),
      },
      {
        path: 'project',
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WriterRoutingModule {
}
