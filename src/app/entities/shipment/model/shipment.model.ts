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
