import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { Register } from '../models/Register';
import { Login } from '../models/Login';
import { User } from '../models/User';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifie qu'il n'y a pas de requêtes HTTP en attente
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('devrait envoyer une requête POST pour register', () => {
    const mockUser: User = { id: 1, login: 'testUser' } as any;
    const mockRegisterData: Register = { login: 'testUser', password: 'password' } as any;

    service.register(mockRegisterData).subscribe((data) => {
      expect(data).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterData);
    
    req.flush(mockUser); // Simule la réponse du serveur
  });

  it('devrait envoyer une requête POST pour login avec le bon type de réponse', () => {
    const mockLoginData: Login = { login: 'testUser', password: 'password' } as any;
    const mockToken = 'jwt_token_string';

    service.login(mockLoginData).subscribe((token) => {
      expect(token).toBe(mockToken);
    });

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toBe('text'); // Vérification de la configuration de la requête
    
    req.flush(mockToken);
  });

  it('devrait envoyer une requête GET pour read', () => {
    const mockUser: User = { id: 1, login: 'testUser' } as any;
    const loginParam = 'testUser';

    service.read(loginParam).subscribe((data) => {
      expect(data).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`/api/read/${loginParam}`);
    expect(req.request.method).toBe('GET');
    
    req.flush(mockUser);
  });

  it('devrait envoyer une requête GET pour readList', () => {
    const mockUserList: User[] = [
      { id: 1, login: 'user1' },
      { id: 2, login: 'user2' }
    ] as any;

    service.readList().subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockUserList);
    });

    const req = httpMock.expectOne('/api/readlist');
    expect(req.request.method).toBe('GET');
    
    req.flush(mockUserList);
  });

  it('devrait envoyer une requête DELETE', () => {
    const loginParam = 'testUser';

    service.delete(loginParam).subscribe(() => {
      // Pas de valeur de retour attendue (void)
    });

    const req = httpMock.expectOne(`/api/delete/${loginParam}`);
    expect(req.request.method).toBe('DELETE');
    
    req.flush({});
  });

  it('devrait envoyer une requête PATCH pour update', () => {
    const mockUpdateData = { login: 'testUser', email: 'new@mail.com' };

    service.update(mockUpdateData).subscribe(() => {
      // Pas de valeur de retour attendue (void)
    });

    const req = httpMock.expectOne('/api/update');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockUpdateData);
    
    req.flush({});
  });
});