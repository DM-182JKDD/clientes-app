import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css',
})
export class ClienteFormComponent implements OnChanges {
  @Input() cliente: Cliente | null = null;
  @Output() clienteGuardado = new EventEmitter<void>();
  @Output() cancelarEdicion = new EventEmitter<void>();

  clienteForm: FormGroup;
  isSubmitting = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    public clienteService: ClienteService
  ) {
    this.clienteForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente'] && this.cliente) {
      this.populateForm(this.cliente);
    } else if (changes['cliente'] && !this.cliente) {
      this.resetForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombreCliente: ['', [Validators.required, Validators.maxLength(100)]],
      direccionCliente: ['', [Validators.required, Validators.maxLength(200)]],
      telefonoCliente: [
        '',
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(20),
          Validators.pattern(/^[0-9+\-\s()]+$/),
        ],
      ],
    });
  }

  private populateForm(cliente: Cliente): void {
    this.clienteForm.patchValue({
      nombreCliente: cliente.nombreCliente,
      direccionCliente: cliente.direccionCliente,
      telefonoCliente: cliente.telefonoCliente,
    });
  }

  private resetForm(): void {
    this.clienteForm.reset();
    this.clienteService.clearMessages();
  }

  get isEditing(): boolean {
    return this.cliente !== null;
  }

  get formTitle(): string {
    return this.isEditing ? 'Editar Cliente' : 'Nuevo Cliente';
  }

  get submitButtonText(): string {
    return this.isEditing ? 'Actualizar' : 'Crear';
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formData = this.clienteForm.value as Cliente;

    const operation$ = this.isEditing && this.cliente
      ? this.clienteService.update(this.cliente.codigoCliente, formData)
      : this.clienteService.create(formData);

    operation$.subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.resetForm();
          this.clienteGuardado.emit();
        } else {
          this.clienteService.setError(response.error || 'Error al guardar el cliente');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const message = err.error?.error || 'Error de conexión con el servidor';
        this.clienteService.setError(message);
      },
    });
  }

  onCancel(): void {
    this.resetForm();
    this.cancelarEdicion.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clienteForm.get(fieldName);
    return field !== null && field.invalid && field.touched;
  }

  getFieldError(fieldName: string): string {
    const field = this.clienteForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    if (field.errors['maxlength']) {
      return `${this.getFieldLabel(fieldName)} no puede exceder ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    if (field.errors['minlength']) {
      return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    if (field.errors['pattern']) {
      return `${this.getFieldLabel(fieldName)} solo puede contener números, espacios, guiones, paréntesis y el signo +`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      nombreCliente: 'El nombre',
      direccionCliente: 'La dirección',
      telefonoCliente: 'El teléfono',
    };
    return labels[fieldName] || fieldName;
  }
}
