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

export interface ShipmentTelemetry {
  latitude: number;
  longitude: number;
  temperature: number;
  timestamp: string;
}

export interface ShipmentDetail {
  id: number;
  status: ShipmentStatus;
  telemetry: ShipmentTelemetry[];
  currentTemp: number | null;
  trackingId?: string;
  description?: string;
  origin?: string;
  destination?: string;
  minTemperature?: number;
  maxTemperature?: number;
  estimatedArrival?: string;
}
