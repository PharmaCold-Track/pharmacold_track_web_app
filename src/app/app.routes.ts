import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { MainLayoutComponent } from './features/layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'shipments',
        loadComponent: () => import('./pages/shipments/shipment-list/shipment-list.component').then(m => m.ShipmentListComponent)
      },
      {
        path: 'shipments/create',
        loadComponent: () => import('./pages/shipments/create-shipment/create-shipment.component').then(m => m.CreateShipmentComponent)
      }
    ]
  }
];
