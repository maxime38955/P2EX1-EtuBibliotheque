import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { Register } from '../../core/models/Register';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Login } from '../../core/models/Login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent {
 private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  registerForm: FormGroup = new FormGroup({});
  submitted: boolean = false;

  constructor(private router: Router){
    
   } 
 

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        login: ['', Validators.required],
        password: ['', Validators.required]
      },
    );
  }

  get form() {
    return this.registerForm.controls;
  }

  onSubmit(): void {

  
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
  
    const loginUser: Login = {
      login: this.registerForm.get('login')?.value,
      password: this.registerForm.get('password')?.value
    };
      this.userService.login(this.registerForm.value).subscribe({
      next: (token: string) => {
        localStorage.removeItem('token');
        localStorage.setItem('token', token); // Stockage du JWT
        console.log("Connecté avec succès");
        this.router.navigateByUrl(`list`);
      },
      error: (err) => {
          alert('Identifiant incorecte !');
        console.error("Erreur de login", err);
      }
    });

     
  }

  onHome(): void {
     
    this.router.navigateByUrl(``);
  }

   onRegister(): void {
    this.submitted = false;
     this.router.navigateByUrl(`register`);
  }



  
}
