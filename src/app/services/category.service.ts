import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '@app/models';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'http://localhost:8080/api/v1/category';

  private http = inject(HttpClient);

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  addCategory(category: Omit<Category, 'id'>): Observable<void> {
    return this.http.post<void>(this.baseUrl, { ...category }).pipe(
      catchError((error) => {
        console.error('Error en la llamada:', error);
        throw error;
      })
    );
  }

  updateCategory(category: Category): Observable<void> {
    return this.http.put<void>(this.baseUrl, { ...category }).pipe(
      catchError((error) => {
        console.error('Error en la llamada:', error);
        throw error;
      })
    );
  }

  removeCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => {
        console.info('Error prevented for testing');
        return Promise.resolve();
      })
    );
  }
}
