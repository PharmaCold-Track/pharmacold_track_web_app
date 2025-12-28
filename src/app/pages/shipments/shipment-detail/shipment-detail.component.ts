import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ShipmentService } from '../../../entities/shipment/api/shipment.service';
import { ShipmentDetail } from '../../../entities/shipment/model/shipment.model';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shipment-detail.component.html',
  styleUrls: ['./shipment-detail.component.scss']
})
export class ShipmentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private shipmentService = inject(ShipmentService);

  shipment = signal<ShipmentDetail | null>(null);
  isLoading = signal(true);

  mapPlaceholderUrl = 'https://maps.googleapis.com/maps/api/staticmap?center=-12.0464,-77.0428&zoom=12&size=600x300&maptype=roadmap&key=YOUR_API_KEY';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadShipment(Number(id));
    }
  }

  loadShipment(id: number) {
    this.shipmentService.getById(id).subscribe({
      next: (data) => {
        this.shipment.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  getTempColor(temp: number): string {
    if (temp > 8) return 'var(--danger-color)';
    if (temp < 2) return '#3dc2ff';
    return 'var(--success-color)';
  }

  getBarHeight(temp: number): string {
    const height = Math.min((temp / 20) * 100, 100);
    return `${Math.max(height, 10)}%`;
  }
}
