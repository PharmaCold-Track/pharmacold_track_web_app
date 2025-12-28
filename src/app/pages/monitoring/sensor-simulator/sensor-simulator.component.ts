import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShipmentService } from '../../../entities/shipment/api/shipment.service';
import { TelemetryService } from '../../../entities/telemetry/api/telemetry.service';
import { Shipment } from '../../../entities/shipment/model/shipment.model';

@Component({
  selector: 'app-sensor-simulator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sensor-simulator.component.html',
  styleUrls: ['./sensor-simulator.component.scss']
})
export class SensorSimulatorComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private telemetryService = inject(TelemetryService);
  private fb = inject(FormBuilder);

  activeShipments = signal<Shipment[]>([]);
  isLoading = signal(true);
  isSending = signal(false);
  successMessage = signal('');

  form = this.fb.group({
    shipmentId: ['', Validators.required],
    temperature: [5.0, Validators.required],
    latitude: [-12.0464, Validators.required],
    longitude: [-77.0428, Validators.required]
  });

  ngOnInit() {
    this.loadActiveShipments();
  }

  loadActiveShipments() {
    this.isLoading.set(true);
    this.shipmentService.getAll({ status: 'IN_TRANSIT' }).subscribe({
      next: (data) => {
        this.activeShipments.set(data);
        this.isLoading.set(false);
        if (data.length > 0) {
          this.form.patchValue({ shipmentId: data[0].trackingId });
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

  randomizeLocation() {
    const currentLat = this.form.get('latitude')?.value || -12.0464;
    const currentLng = this.form.get('longitude')?.value || -77.0428;

    const newLat = currentLat + (Math.random() - 0.5) * 0.01;
    const newLng = currentLng + (Math.random() - 0.5) * 0.01;

    this.form.patchValue({ latitude: Number(newLat.toFixed(4)), longitude: Number(newLng.toFixed(4)) });
  }

  setCriticalTemp() {
    this.form.patchValue({ temperature: 15.0 });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isSending.set(true);
    this.successMessage.set('');

    const formVal = this.form.value;

    const payload = {
      shipmentTrackingId: formVal.shipmentId!,
      latitude: Number(formVal.latitude),
      longitude: Number(formVal.longitude),
      temperature: Number(formVal.temperature),
      timestamp: new Date().toISOString()
    };

    this.telemetryService.create(payload).subscribe({
      next: () => {
        this.isSending.set(false);
        this.successMessage.set(`✅ Dato enviado: ${payload.temperature}°C a las ${new Date().toLocaleTimeString()}`);

        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        console.error(err);
        this.isSending.set(false);
      }
    });
  }
}
