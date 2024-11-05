import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '@app/models';
import { catchError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/v1/product';

  private http = inject(HttpClient);

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<void> {
    return this.http.post<void>(this.baseUrl, { ...product }).pipe(
      catchError((error) => {
        console.error('Error en la llamada:', error);
        throw error;
      })
    );
  }

  updateProduct(product: Product): Observable<void> {
    return this.http.put<void>(this.baseUrl, { ...product }).pipe(
      catchError((error) => {
        console.error('Error en la llamada:', error);
        throw error;
      })
    );
  }

  removeProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => {
        console.info('Error prevented for testing');
        return Promise.resolve();
      })
    );
  }
}
