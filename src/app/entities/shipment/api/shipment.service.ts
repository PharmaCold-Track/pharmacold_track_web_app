import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {Shipment, ShipmentDetail, ShipmentStatus} from '../model/shipment.model';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shipments`;

  getAll(filters?: { status?: ShipmentStatus; fromDate?: string }): Observable<Shipment[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.fromDate) params = params.set('fromDate', filters.fromDate);

    return this.http.get<Shipment[]>(this.apiUrl, { params });
  }

  create(shipment: Omit<Shipment, 'id' | 'trackingId' | 'status'>): Observable<Shipment> {
    return this.http.post<Shipment>(this.apiUrl, shipment);
  }

  getById(id: number): Observable<ShipmentDetail> {
    return this.http.get<ShipmentDetail>(`${this.apiUrl}/${id}`);
  }

  registerDeparture(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/departure`, {});
  }

  registerDelivery(id: number, data: { recipientSignature: string; notes: string }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/delivery`, data);
  }
}
