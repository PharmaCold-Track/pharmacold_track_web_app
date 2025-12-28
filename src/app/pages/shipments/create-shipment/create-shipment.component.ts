import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ShipmentService } from '../../../entities/shipment/api/shipment.service';

@Component({
  selector: 'app-create-shipment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-shipment.component.html',
  styleUrls: ['./create-shipment.component.scss']
})
export class CreateShipmentComponent {
  private fb = inject(FormBuilder);
  private shipmentService = inject(ShipmentService);
  private router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal('');

  form = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(5)]],
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    minTemperature: [2.0, [Validators.required]],
    maxTemperature: [8.0, [Validators.required]],
    contactEmail: ['', [Validators.required, Validators.email]],
    estimatedArrival: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { minTemperature, maxTemperature } = this.form.getRawValue();

    if (minTemperature! >= maxTemperature!) {
      this.errorMessage.set('La temperatura mínima debe ser menor a la máxima.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const shipmentData: any = this.form.value;

    this.shipmentService.create(shipmentData).subscribe({
      next: () => {
        this.router.navigate(['/shipments']);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
        this.errorMessage.set('Error al crear el envío. Verifique los datos.');
      }
    });
  }
}
