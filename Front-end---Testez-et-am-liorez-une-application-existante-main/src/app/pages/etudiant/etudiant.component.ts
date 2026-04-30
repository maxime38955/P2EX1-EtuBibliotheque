import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/service/user.service';
import { User } from '../../core/models/User';

@Component({
  selector: 'app-etudiant',
  standalone: true,
  imports: [ReactiveFormsModule], // Obligatoire pour [formGroup]
  templateUrl: './etudiant.component.html',
  styleUrl: './etudiant.component.css'
})
export class EtudiantComponent implements OnInit {
  studentForm: FormGroup;
  isEditable = false;
  loginParam: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    // Initialisation du formulaire
    this.studentForm = this.fb.group({
      id: [{ value: '', disabled: true }], // Toujours désactivé
      firstName: [{ value: '', disabled: true }, Validators.required],
      lastName: [{ value: '', disabled: true }, Validators.required],
      login: [{ value: '', disabled: true }, Validators.required],
      password: [{ value: '', disabled: true }] // Optionnel pour l'update
    });
  }

  ngOnInit(): void {
    // Récupération du login dans l'URL (ex: /etudiant/jdupont)
    this.loginParam = this.route.snapshot.paramMap.get('login') || '';
    this.loadStudent();
  }

  loadStudent() {
    this.userService.read(this.loginParam).subscribe((user: any) => {
      this.studentForm.patchValue(user);
    });
  }

  toggleEdit() {
    this.isEditable = !this.isEditable;
    if (this.isEditable) {
      this.studentForm.enable();
      this.studentForm.get('id')?.disable(); // L'ID ne doit jamais changer
    } else {
      this.studentForm.disable();
    }
  }

  onSave() {
    if (this.studentForm.valid) {
      // getRawValue() permet de récupérer aussi les champs disabled (comme l'ID)
      this.userService.update(this.studentForm.getRawValue()).subscribe({
        next: () => {
          alert('Utilisateur mis à jour !');
          this.toggleEdit();
             this.router.navigate(['/list']);
        },
        error: (err) =>   alert('Mis à jour impossible !')
        
      });
    }
  }

  onDelete() {
    if (confirm(`Supprimer définitivement ${this.loginParam} ?`)) {
      this.userService.delete(this.loginParam).subscribe(() => {
        this.router.navigate(['/list']); // Retour à la liste après suppression
      });
    }
  }

 

   onReturn(): void {
     
     this.router.navigateByUrl(`list`);
  }
 
}