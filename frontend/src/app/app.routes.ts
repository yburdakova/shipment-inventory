import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {path: '', component: AuthComponent},
  {path:'dashboard', component: DashboardComponent}

];
