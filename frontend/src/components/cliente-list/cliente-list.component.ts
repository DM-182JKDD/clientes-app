import { Component, effect, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css',
})
export class ClienteListComponent implements OnInit {
  @Output() editarCliente = new EventEmitter<Cliente>();

  clientes = signal<Cliente[]>([]);
  confirmDelete = signal<Cliente | null>(null);

  constructor(public clienteService: ClienteService) {
    effect(() => {
      this.clienteService.clientesActualizados();
      this.loadClientes();
    });
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.clientes.set(response.data);
        } else {
          this.clienteService.setError(response.error || 'Error al cargar los clientes');
        }
      },
      error: (err) => {
        const message = err.error?.error || 'Error de conexión con el servidor';
        this.clienteService.setError(message);
      },
    });
  }

  onEdit(cliente: Cliente): void {
    this.editarCliente.emit(cliente);
  }

  requestDelete(cliente: Cliente): void {
    this.confirmDelete.set(cliente);
  }

  confirmDeleteAction(): void {
    const cliente = this.confirmDelete();
    if (!cliente) return;

    this.clienteService.delete(cliente.codigoCliente).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadClientes();
        } else {
          this.clienteService.setError(response.error || 'Error al eliminar el cliente');
        }
        this.confirmDelete.set(null);
      },
      error: (err) => {
        const message = err.error?.error || 'Error de conexión con el servidor';
        this.clienteService.setError(message);
        this.confirmDelete.set(null);
      },
    });
  }

  cancelDelete(): void {
    this.confirmDelete.set(null);
  }

  formatTelefono(telefono: string): string {
    return telefono;
  }

  trackByCodigo(_index: number, cliente: Cliente): number {
    return cliente.codigoCliente;
  }
}
