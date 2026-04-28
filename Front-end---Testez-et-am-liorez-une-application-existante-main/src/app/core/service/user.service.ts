import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { Login } from '../models/Login';
import { User } from '../models/User'; // Supposons que tu as un modèle User
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }

  register(user: Register): Observable<User> {
    return this.httpClient.post<User>('/api/register', user);
  }

  login(loginData: Login): Observable<string> {
    // On précise {responseType: 'text'} car le backend renvoie le JWT
    return this.httpClient.post('/api/login', loginData, { responseType: 'text' });
  }

  read(login: string): Observable<User> {
    return this.httpClient.get<User>(`/api/read/${login}` );
  }

  readList(): Observable<User[]> {
    return this.httpClient.get<User[]>('/api/readlist');
  }

  delete(login: string): Observable<void> {
    return this.httpClient.delete<void>(`/api/delete/${login}` );
  }

  // N'oublie pas de créer et d'utiliser UserUpdateDTO ici !
  update(user: any): Observable<void> {
    return this.httpClient.patch<void>("/api/update", user);
  }
}