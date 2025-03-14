import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { ReturnComponent } from './pages/return/return.component';
import { DeliveryDetailsComponent } from './pages/delivery-details/delivery-details.component';
import { BoxDetailsComponent } from './pages/box-details/box-details.component';

export const routes: Routes = [
  { path: '', component: AuthComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
          { path: '', redirectTo: 'favorite', pathMatch: 'full' },
          { path: 'project/:id', component: ProjectDetailsComponent },
          { path: 'box/:id', component: BoxDetailsComponent },
          { path: 'project/:id/:deliveryDate', component: DeliveryDetailsComponent}
        ]
      },
      { path: 'delivery', component: DeliveryComponent },
      { path: 'return', component: ReturnComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
