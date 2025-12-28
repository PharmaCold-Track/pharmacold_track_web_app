import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; // Importar Forms
import { ShipmentService } from '../../../entities/shipment/api/shipment.service';
import { ShipmentDetail } from '../../../entities/shipment/model/shipment.model';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './shipment-detail.component.html',
  styleUrls: ['./shipment-detail.component.scss']
})
export class ShipmentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private shipmentService = inject(ShipmentService);
  private fb = inject(FormBuilder);

  @ViewChild('deliveryDialog') deliveryDialog!: ElementRef<HTMLDialogElement>;

  shipment = signal<ShipmentDetail | null>(null);
  isLoading = signal(true);
  isActionLoading = signal(false);

  deliveryForm = this.fb.group({
    recipientSignature: ['', Validators.required],
    notes: ['']
  });

  mapPlaceholderUrl = '';

  ngOnInit() {
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
        this.updateMapUrl(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  onDeparture() {
    if (!confirm('¿Confirmar salida del transporte? El estado cambiará a IN_TRANSIT.')) return;

    const id = this.shipment()?.id;
    if (!id) return;

    this.isActionLoading.set(true);
    this.shipmentService.registerDeparture(id).subscribe({
      next: () => {
        this.isActionLoading.set(false);
        this.loadShipment(id);
      },
      error: () => this.isActionLoading.set(false)
    });
  }

  openDeliveryModal() {
    this.deliveryDialog.nativeElement.showModal();
  }

  closeDeliveryModal() {
    this.deliveryDialog.nativeElement.close();
    this.deliveryForm.reset();
  }

  onDeliverySubmit() {
    if (this.deliveryForm.invalid) return;

    const id = this.shipment()?.id;
    if (!id) return;

    const { recipientSignature, notes } = this.deliveryForm.value;

    this.isActionLoading.set(true);
    this.shipmentService.registerDelivery(id, {
      recipientSignature: recipientSignature!,
      notes: notes || ''
    }).subscribe({
      next: () => {
        this.isActionLoading.set(false);
        this.closeDeliveryModal();
        this.loadShipment(id);
      },
      error: () => this.isActionLoading.set(false)
    });
  }

  getTempColor(temp: number): string {
    if (temp > (this.shipment()?.maxTemperature || 8)) return 'var(--danger-color)';
    if (temp < (this.shipment()?.minTemperature || 2)) return '#3dc2ff';
    return 'var(--success-color)';
  }

  getBarHeight(temp: number): string {
    const max = 30;
    return `${Math.min((Math.abs(temp) / max) * 100, 100)}%`;
  }

  private updateMapUrl(data: ShipmentDetail) {
    this.mapPlaceholderUrl = `https://maps.googleapis.com/maps/api/staticmap?center=-12.0464,-77.0428&zoom=12&size=600x300&maptype=roadmap&key=TU_API_KEY_AQUI`;
  }
}
