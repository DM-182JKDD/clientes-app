import { Component } from '@angular/core';
import { ClienteFormComponent } from './components/cliente-form/cliente-form.component';
import { ClienteListComponent } from './components/cliente-list/cliente-list.component';
import { Cliente } from './models/cliente.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ClienteFormComponent, ClienteListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Administración de Clientes';
  clienteSeleccionado: Cliente | null = null;

  onClienteEdit(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
  }

  onClienteSaved(): void {
    this.clienteSeleccionado = null;
  }

  onFormCancel(): void {
    this.clienteSeleccionado = null;
  }
}
