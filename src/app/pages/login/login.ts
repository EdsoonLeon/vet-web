import { Component ,inject} from '@angular/core';
import {ReactiveFormsModule,FormBuilder,Validators} from '@angular/forms'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['',[Validators.required]]
  });

  onSubmit() {
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
    console.log('Datos del formulario',this.loginForm.value);
    //Aqui conectamos con API para enviar los datos del formulario
  }
}
