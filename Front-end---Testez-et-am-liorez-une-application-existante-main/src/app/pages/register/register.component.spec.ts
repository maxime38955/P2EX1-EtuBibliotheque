import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { UserService } from '../../core/service/user.service';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let routerMock: any;
  let userServiceMock: any;

  beforeEach(async () => {
    routerMock = {
      navigateByUrl: jest.fn()
    };

    userServiceMock = {
      register: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait naviguer vers la page de login lors de l\'appel de onLogin', () => {
    component.onLogin();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('login');
  });

  it('devrait naviguer vers la page home lors de l\'appel de onHome', () => {
    component.onHome();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('');
  });

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
    expect(userServiceMock.register).not.toHaveBeenCalled();
  });

  it('devrait naviguer vers la page login en cas de succès de l\'inscription', () => {
    // Arrange
    const formValues = { 
      login: 'testUser', 
      password: 'password', 
      firstName: 'test', 
      lastName: 'test' 
    };

    component.registerForm = {
      invalid: false,
      // On simule le .get(key) pour qu'il retourne bien la valeur attendue selon la clé
      get: jest.fn().mockImplementation((key: string) => ({ value: formValues[key as keyof typeof formValues] })),
      value: formValues
    } as any;

    // Act
    component.onSubmit();

    // Assert
    expect(userServiceMock.register).toHaveBeenCalledWith(component.registerForm.value);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('login');
  });
});