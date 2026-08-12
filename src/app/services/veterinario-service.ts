import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Veterinario } from '../models/veterinario';

@Injectable({
  providedIn: 'root'
})
export class VeterinarioService {
  private http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8081/api/veterinarios';

  listarVeterinarios(): Observable<Veterinario[]> {
    return this.http.get<Veterinario[]>(this.urlBase);
  }
}