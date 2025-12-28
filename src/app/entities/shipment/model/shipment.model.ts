export type ShipmentStatus = 'CREATED' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPROMISED' | 'CANCELLED';

export interface Shipment {
  id: number;
  trackingId: string;
  status: ShipmentStatus;
  description: string;
  origin: string;
  destination: string;
  minTemperature: number;
  maxTemperature: number;
  estimatedArrival: string;
}

export interface ShipmentDetail {
  id: number;
  status: ShipmentStatus;
  telemetryHistory: number[];
  currentTemp: number | null;
  trackingId?: string;
  description?: string;
  origin?: string;
  destination?: string;
  minTemperature?: number;
  maxTemperature?: number;
  estimatedArrival?: string;
}
