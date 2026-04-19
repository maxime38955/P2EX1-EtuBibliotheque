import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/service/user.service'; // Ajuste le chemin
import { User } from '../../core/models/User'; // Ton interface User
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [], // Si tu n'utilises pas de modules, c'est ici
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  students: User[] = []; // Variable pour stocker la liste
  

  constructor(private userService: UserService,  private router: Router) {}

  

  ngOnInit(): void {
    this.userService.readList().subscribe({
      next: (data: any) => {
        this.students = data; // On stocke les données reçues
      },
      error: (err) => {
        console.error("Erreur lors du chargement :", err);
      }
    });
  }



  onViewDetails(student: User): void {
    console.log("Détails demandés pour : ", student.firstName );
    // Optionnel : Navigation vers une page de détails
     this.router.navigateByUrl(`etudiant/${student.login}`);
     
    }
}