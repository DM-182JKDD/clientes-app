import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cliente, ClienteDTO, ApiResponse } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly apiUrl = 'http://localhost:3000/clientes';

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly clientesActualizados = signal<number>(0);

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Cliente[]>> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<ApiResponse<Cliente[]>>(this.apiUrl).pipe(
      tap({
        next: () => this.loading.set(false),
        error: () => this.loading.set(false),
      })
    );
  }

  getByCodigo(codigo: number): Observable<ApiResponse<Cliente>> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<ApiResponse<Cliente>>(`${this.apiUrl}/${codigo}`).pipe(
      tap({
        next: () => this.loading.set(false),
        error: () => this.loading.set(false),
      })
    );
  }

  create(cliente: ClienteDTO): Observable<ApiResponse<Cliente>> {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);
    return this.http.post<ApiResponse<Cliente>>(this.apiUrl, cliente).pipe(
      tap({
        next: (response) => {
          this.loading.set(false);
          if (response.success) {
            this.clientesActualizados.update(v => v + 1);
            if (response.message) {
              this.success.set(response.message);
            }
          }
        },
        error: () => this.loading.set(false),
      })
    );
  }

  update(codigo: number, cliente: ClienteDTO): Observable<ApiResponse<Cliente>> {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);
    return this.http.put<ApiResponse<Cliente>>(`${this.apiUrl}/${codigo}`, cliente).pipe(
      tap({
        next: (response) => {
          this.loading.set(false);
          if (response.success) {
            this.clientesActualizados.update(v => v + 1);
            if (response.message) {
              this.success.set(response.message);
            }
          }
        },
        error: () => this.loading.set(false),
      })
    );
  }

  delete(codigo: number): Observable<ApiResponse<null>> {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${codigo}`).pipe(
      tap({
        next: (response) => {
          this.loading.set(false);
          if (response.success) {
            this.clientesActualizados.update(v => v + 1);
            if (response.message) {
              this.success.set(response.message);
            }
          }
        },
        error: () => this.loading.set(false),
      })
    );
  }

  clearMessages(): void {
    this.error.set(null);
    this.success.set(null);
  }

  setError(message: string): void {
    this.error.set(message);
    this.loading.set(false);
  }
}
