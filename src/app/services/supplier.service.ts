import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Supplier } from '@app/models';
import { catchError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private baseUrl = 'http://localhost:8080/api/v1/supplier';

  private http = inject(HttpClient);

  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.baseUrl);
  }

  getSupplier(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/${id}`);
  }

  addSupplier(supplier: Omit<Supplier, 'id'>): Observable<void> {
    return this.http.post<void>(this.baseUrl, { ...supplier }).pipe(
      catchError((error) => {
        console.error('Error en la llamada:', error);
        throw error;
      })
    );
  }

  updateSupplier(supplier: Supplier): Observable<void> {
    return this.http.put<void>(this.baseUrl, { ...supplier }).pipe(
      catchError((error) => {
        console.error('Error en la llamada:', error);
        throw error;
      })
    );
  }

  removeSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => {
        console.info('Error prevented for testing');
        return Promise.resolve();
      })
    );
  }
}
