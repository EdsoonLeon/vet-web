import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { Veterinario } from './pages/veterinario/veterinario';
import { Recepcionista } from './pages/recepcionista/recepcionista';
import { Clientes } from './pages/recepcionista/clientes/clientes';
import { Mascotas } from './pages/recepcionista/mascotas/mascotas';
import { Citas } from './pages/recepcionista/citas/citas';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin },
  { path: 'veterinario', component: Veterinario },
  {
    path: 'recepcionista',
    component: Recepcionista,
    children: [
      { path: '', redirectTo: 'clientes', pathMatch: 'full' },
      { path: 'clientes', component: Clientes },
      { path: 'mascotas', component: Mascotas },
      { path: 'citas', component: Citas },
    ]
  },
];