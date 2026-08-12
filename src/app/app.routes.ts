import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import {Admin} from './pages/admin/admin';
import {Cliente} from './pages/cliente/cliente';
import {Veterinario} from './pages/veterinario/veterinario';
import { Recepcionista } from './pages/recepcionista/recepcionista';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'admin', component: Admin },
    { path: 'cliente', component: Cliente },
    { path: 'veterinario', component: Veterinario },
    { path: 'recepcionista', component: Recepcionista }
];