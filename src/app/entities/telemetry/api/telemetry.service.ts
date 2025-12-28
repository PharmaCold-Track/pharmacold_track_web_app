import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CreateTelemetryRequest {
  shipmentTrackingId: string;
  latitude: number;
  longitude: number;
  temperature: number;
  timestamp: string; // ISO format
}

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/telemetry`;

  create(data: CreateTelemetryRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, data);
  }
}
