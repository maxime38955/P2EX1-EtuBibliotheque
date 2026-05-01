import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let routerMock: any;
  // 1. Déclarez un espion (spy) ou un mock pour le Router
  

  beforeEach(async () => {
    // Initialisation du mock avec Jest
    routerMock = {
      navigateByUrl: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait naviguer vers la page de login lors de l\'appel de onLogin', () => {
    // Act
    component.onLogin();

    // Assert
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('login');
  });

  it('devrait naviguer vers la page de register lors de l\'appel de onRegister', () => {
    // Act
    component.onRegister();

    // Assert
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('register');
  });
});