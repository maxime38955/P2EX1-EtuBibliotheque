import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListComponent } from './list.component'; // (Ou LoginComponent selon le fichier)
import { User } from '../../core/models/User'; // Ton interface User
import { Router } from '@angular/router';


describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let routerMock: any;

  

  beforeEach(async () => {

     routerMock = {
      navigateByUrl: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ListComponent, HttpClientTestingModule],
      providers: [
        
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it('devrait naviguer vers la page de home lors de l\'appel de onHome', () => {
    // Act
    component.onHome();

    // Assert
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('');
  });

  it('devrait naviguer vers la page de register lors de l\'appel de onRegister', () => {
    // Act
    component.onRegister();

    // Assert
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('register');
  });

   it('devrait naviguer vers la page de login lors de l\'appel de onLogin', () => {
    // Act
    component.onLogin();

    // Assert
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('login');
  });

  it('devrait naviguer vers la page de  lors de l\'appel de onRegister', () => {
   const mockUser: User = { id: 1, login: 'testUser' } as any;
   
    // Act
    component.onViewDetails(mockUser);

    // Assert
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`etudiant/${mockUser.login}`);
  });



});
