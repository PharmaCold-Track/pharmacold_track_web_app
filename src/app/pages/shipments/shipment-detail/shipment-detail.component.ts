import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { ShipmentService } from '../../../entities/shipment/api/shipment.service';
import { ShipmentDetail } from '../../../entities/shipment/model/shipment.model';
// Importamos el nuevo servicio
import { GoogleMapsLoaderService } from '../../../shared/services/google-maps-loader.service';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './shipment-detail.component.html',
  styleUrls: ['./shipment-detail.component.scss']
})
export class ShipmentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private shipmentService = inject(ShipmentService);
  private fb = inject(FormBuilder);
  private mapsLoader = inject(GoogleMapsLoaderService);

  @ViewChild('deliveryDialog') deliveryDialog!: ElementRef<HTMLDialogElement>;

  shipment = signal<ShipmentDetail | null>(null);
  isLoading = signal(true);
  isActionLoading = signal(false);

  apiLoaded = signal(false);

  mapOptions: google.maps.MapOptions = {
    zoom: 12,
    mapTypeId: 'roadmap',
    disableDefaultUI: false,
    zoomControl: true,
    center: { lat: -12.0464, lng: -77.0428 }
  };

  routePath: google.maps.LatLngLiteral[] = [];
  truckPosition: google.maps.LatLngLiteral | undefined;
  centerPosition: google.maps.LatLngLiteral = { lat: -12.0464, lng: -77.0428 };

  deliveryForm = this.fb.group({
    recipientSignature: ['', Validators.required],
    notes: ['']
  });

  async ngOnInit() {
    try {
      await this.mapsLoader.load();
      console.log('🗺️ Google Maps cargado correctamente');
      this.apiLoaded.set(true);
    } catch (error) {
      console.error('Error crítico cargando Google Maps:', error);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadShipment(Number(id));
    }
  }

  loadShipment(id: number) {
    this.isLoading.set(true);
    this.shipmentService.getById(id).subscribe({
      next: (data) => {
        this.shipment.set(data);
        this.processMapData(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  processMapData(data: ShipmentDetail) {
    if (data.telemetry && data.telemetry.length > 0) {
      this.routePath = data.telemetry.map(t => ({
        lat: t.latitude,
        lng: t.longitude
      }));

      const lastPoint = this.routePath[this.routePath.length - 1];
      this.truckPosition = lastPoint;
      this.centerPosition = lastPoint;

      // Actualizamos el centro del mapa
      if (this.apiLoaded()) {
        this.mapOptions = { ...this.mapOptions, center: this.centerPosition };
      }
    }
  }

  // ... (Resto de métodos: onDeparture, delivery, helpers se mantienen igual)
  onDeparture() {
    if (!confirm('¿Confirmar salida del transporte?')) return;
    const id = this.shipment()?.id;
    if (!id) return;
    this.isActionLoading.set(true);
    this.shipmentService.registerDeparture(id).subscribe({
      next: () => { this.isActionLoading.set(false); this.loadShipment(id); },
      error: () => this.isActionLoading.set(false)
    });
  }

  openDeliveryModal() { this.deliveryDialog.nativeElement.showModal(); }
  closeDeliveryModal() { this.deliveryDialog.nativeElement.close(); this.deliveryForm.reset(); }

  onDeliverySubmit() {
    if (this.deliveryForm.invalid) return;
    const id = this.shipment()?.id;
    if (!id) return;
    this.isActionLoading.set(true);
    this.shipmentService.registerDelivery(id, this.deliveryForm.value as any).subscribe({
      next: () => { this.isActionLoading.set(false); this.closeDeliveryModal(); this.loadShipment(id); },
      error: () => this.isActionLoading.set(false)
    });
  }

  getTempColor(temp: number): string {
    const min = this.shipment()?.minTemperature || 2;
    const max = this.shipment()?.maxTemperature || 8;
    if (temp > max) return 'var(--danger-color)';
    if (temp < min) return '#3dc2ff';
    return 'var(--success-color)';
  }

  getBarHeight(temp: number): string {
    const max = 30;
    return `${Math.min((Math.abs(temp) / max) * 100, 100)}%`;
  }
}
