import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';

export const routes: Routes = [
  { path: '', component: AuthComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
          { path: 'project/:id', component: ProjectDetailsComponent }
        ]
      }
    ]
  }
];
