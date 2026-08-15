import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario-service';
import { UsuarioAuthService } from '../../../services/usuario-auth-service';
import { RolService } from '../../../services/rol-service';
import { Usuario } from '../../../models/usuario';
import { Rol } from '../../../models/rol';
import { ConfirmModal } from '../../../components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmModal],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {
  private usuarioService = inject(UsuarioService);
  private usuarioAuthService = inject(UsuarioAuthService);
  private rolService = inject(RolService);
  private fb = inject(FormBuilder);

  usuarios = signal<Usuario[]>([]);
  roles = signal<Rol[]>([]);
  mostrarFormulario = false;
  usuarioEditandoId: number | null = null;
  mensajeError = signal('');

  mostrarConfirmacion = false;
  idAEliminar: number | null = null;

  usuarioForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    clave: [''],
    rolId: ['', Validators.required],
  });

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => this.usuarios.set(data),
      error: () => this.mensajeError.set('No se pudo cargar la lista de usuarios')
    });
  }

  cargarRoles() {
    this.rolService.listarRoles().subscribe({
      next: (data) => this.roles.set(data)
    });
  }

  abrirNuevo() {
    this.usuarioEditandoId = null;
    this.usuarioForm.reset();
    this.usuarioForm.get('clave')?.setValidators([Validators.required]);
    this.usuarioForm.get('clave')?.updateValueAndValidity();
    this.mostrarFormulario = true;
  }

  abrirEditar(usuario: Usuario) {
    this.usuarioEditandoId = usuario.id;
    this.usuarioForm.get('clave')?.clearValidators();
    this.usuarioForm.get('clave')?.updateValueAndValidity();
    this.usuarioForm.setValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      clave: '',
      rolId: String(usuario.rol.id),
    });
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.usuarioEditandoId = null;
    this.usuarioForm.reset();
  }

  guardar() {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const valores = this.usuarioForm.value;

    if (this.usuarioEditandoId) {
      const datosEdicion: any = {
        nombre: valores.nombre,
        apellido: valores.apellido,
        correo: valores.correo,
        rol: { id: Number(valores.rolId) },
      };
      if (valores.clave && valores.clave.trim() !== '') {
        datosEdicion.clave = valores.clave;
      }
      this.usuarioService.editarUsuario(this.usuarioEditandoId, datosEdicion).subscribe({
        next: () => { this.cargarUsuarios(); this.cerrarFormulario(); },
        error: () => this.mensajeError.set('No se pudo editar el usuario')
      });
    } else {
      const datosRegistro = {
        nombre: valores.nombre,
        apellido: valores.apellido,
        correo: valores.correo,
        clave: valores.clave,
        rol: { id: Number(valores.rolId) },
      };
      this.usuarioAuthService.registrarUsuario(datosRegistro).subscribe({
        next: () => { this.cargarUsuarios(); this.cerrarFormulario(); },
        error: () => this.mensajeError.set('No se pudo registrar el usuario')
      });
    }
  }

  pedirEliminar(id: number) {
    this.idAEliminar = id;
    this.mostrarConfirmacion = true;
  }

  confirmarEliminar() {
    this.mostrarConfirmacion = false;
    if (this.idAEliminar === null) return;

    this.usuarioService.eliminarUsuario(this.idAEliminar).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => this.mensajeError.set('No se pudo desactivar el usuario')
    });
    this.idAEliminar = null;
  }

  cancelarEliminar() {
    this.mostrarConfirmacion = false;
    this.idAEliminar = null;
  }

  activar(id: number) {
    this.usuarioService.activarUsuario(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => this.mensajeError.set('No se pudo reactivar el usuario')
    });
  }
}