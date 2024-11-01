import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { redesProfesionalesService } from '../redes-profesionales.service';
import { user } from '../redes-profesionales';

@Component({
  selector: 'app-registrarse',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink 
  ],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.css'
})
export class RegistrarseComponent implements OnInit {
  registerForm: FormGroup;
  mensajeExito: boolean = false;

  constructor(
    private fb: FormBuilder,
    private redesService: redesProfesionalesService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]], 
      confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator }); 
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Formulario enviado', this.registerForm.value);
      
      const newUser = new user(
        0,
        this.registerForm.value.username,
        this.registerForm.value.password,
        this.registerForm.value.email
      );

      this.redesService.obtenerUsuarios().subscribe(users => {
        const nextId = users.length + 1;
        newUser.id = nextId;
        

        users.push(newUser);
        console.log('Usuario creado:', newUser);
        console.log('Lista actualizada de usuarios:', users);
        
        this.mensajeExito = true;
        setTimeout(() => {
          this.mensajeExito = false;
          this.router.navigate(['/iniciarSesion']);
        }, 3000);
      });
    }
  }

  ngOnInit(): void {
  }
}