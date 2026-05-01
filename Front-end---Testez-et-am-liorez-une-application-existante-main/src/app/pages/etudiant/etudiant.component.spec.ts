import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { EtudiantComponent } from './etudiant.component';
import { UserService } from '../../core/service/user.service';

describe('EtudiantComponent', () => {
  let component: EtudiantComponent;
  let fixture: ComponentFixture<EtudiantComponent>;
  let userServiceMock: any;
  let routerMock: any;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (id: string) => '1'  
      }
    }
  };

  beforeEach(async () => {
    userServiceMock = {
      delete: jest.fn().mockReturnValue(of({})), 
      read: jest.fn().mockReturnValue(of({})),
      update: jest.fn().mockReturnValue(of({})) 
    };

    routerMock = {
      navigateByUrl: jest.fn(),
      navigate: jest.fn()  
    };

    await TestBed.configureTestingModule({
      imports: [
        EtudiantComponent, 
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: mockActivatedRoute  
        },
        { 
          provide: Router, 
          useValue: routerMock 
        },
        { 
          provide: UserService, 
          useValue: userServiceMock 
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait naviguer vers la page de liste lors de l\'appel de onReturn', () => {
    component.onReturn();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('list');
  });

  it('devrait supprimer l\'utilisateur si l\'on clique sur OK', () => {
    component.loginParam = 'testUser';
    window.confirm = jest.fn().mockReturnValue(true);

    component.onDelete();

    expect(window.confirm).toHaveBeenCalledWith('Supprimer définitivement testUser ?');
    expect(userServiceMock.delete).toHaveBeenCalledWith('testUser');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/list']);
  });

  it('devrait enregistrer l\'utilisateur si le formulaire est valide', fakeAsync(() => {
    // Arrange: Ajout des méthodes enable et disable dans le mock pour supporter `toggleEdit`
    component.studentForm = {
      valid: true,
      getRawValue: jest.fn().mockReturnValue({ id: '1', login: 'testUser' }),
      enable: jest.fn(),
      disable: jest.fn(),
      get: jest.fn().mockReturnValue({
        disable: jest.fn()
      })
    } as any;

    // Mocker les alertes du navigateur
    window.alert = jest.fn();

    // Act
    component.onSave();
    
    // Résolution de l'observable asynchrone
    tick();

    // Assert
    expect(userServiceMock.update).toHaveBeenCalledWith({ id: '1', login: 'testUser' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/list']);
  }));
});