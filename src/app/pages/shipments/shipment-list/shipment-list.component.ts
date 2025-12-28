import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShipmentService } from '../../../entities/shipment/api/shipment.service';
import { Shipment } from '../../../entities/shipment/model/shipment.model';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shipment-list.component.html',
  styleUrls: ['./shipment-list.component.scss']
})
export class ShipmentListComponent implements OnInit {
  private shipmentService = inject(ShipmentService);

  shipments = signal<Shipment[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadShipments();
  }

  loadShipments() {
    this.isLoading.set(true);
    this.shipmentService.getAll().subscribe({
      next: (data) => {
        this.shipments.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading shipments', err);
        this.isLoading.set(false);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CREATED': return 'badge-info';
      case 'IN_TRANSIT': return 'badge-warning';
      case 'DELIVERED': return 'badge-success';
      case 'COMPROMISED': return 'badge-danger'; // Rojo alarma para tu lógica de negocio
      case 'CANCELLED': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  }
}
