import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { UserService } from '../../core/service/user.service'; // Ajustez le chemin vers le UserService
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerMock: any;
  let userServiceMock: any;

  beforeEach(async () => {
    routerMock = {
      navigateByUrl: jest.fn()
    };

    // Création du mock du service utilisateur
    userServiceMock = {
      login: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: UserService, useValue: userServiceMock } // Injection du mock de UserService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait naviguer vers la page de register lors de l\'appel de onRegister', () => {
    component.onRegister();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('register');
  });

  it('devrait naviguer vers la page home lors de l\'appel de onHome', () => {
    component.onHome();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('');
  });

  // --- NOUVEAU TEST : Cas formulaire invalide ---
  it('ne devrait pas appeler le service si le formulaire est invalide', () => {
    // Arrange
    component.submitted = false;
    component.registerForm = {
      invalid: true // Simule un formulaire invalide
    } as any;

    // Act
    component.onSubmit();

    // Assert
    expect(component.submitted).toBe(true);
    expect(userServiceMock.login).not.toHaveBeenCalled();
  });

  // --- NOUVEAU TEST : Cas succès de connexion ---
  it('devrait stocker le token et naviguer vers la liste en cas de succès de la connexion', () => {
    // Arrange
    component.registerForm = {
      invalid: false,
      get: jest.fn().mockReturnValue({ value: 'testValue' }),
      value: { login: 'testUser', password: 'password' }
    } as any;

    const mockToken = 'mock_jwt_token';
    userServiceMock.login.mockReturnValue(of(mockToken)); // Retourne le token sous forme d'Observable

    // Espionner localStorage
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    // Act
    component.onSubmit();

    // Assert
    expect(userServiceMock.login).toHaveBeenCalledWith(component.registerForm.value);
    expect(removeItemSpy).toHaveBeenCalledWith('token');
    expect(setItemSpy).toHaveBeenCalledWith('token', mockToken);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('list');
  });
});