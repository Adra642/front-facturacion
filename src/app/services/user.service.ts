import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@app/models';
import { catchError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1/user';

  private http = inject(HttpClient);

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  addUser(user: Omit<User, 'id'>): Observable<void> {
    return this.http.post<void>(this.baseUrl, { ...user }).pipe(
      catchError((error) => {
        console.error('Error en la llamada:', error);
        throw error;
      })
    );
  }

  updateUser(user: User): Observable<void> {
    return this.http.put<void>(this.baseUrl, { ...user }).pipe(
      catchError((error) => {
        console.error('Error en la llamada:', error);
        throw error;
      })
    );
  }

  removeUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => {
        console.info('Error prevented for testing');
        return Promise.resolve();
      })
    );
  }
}
