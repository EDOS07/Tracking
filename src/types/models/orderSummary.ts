export interface LocationPoint {
  id: string;
  address: string;
  startDate: Date;
  endDate: Date;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  transportType: string;
  statusText: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: LocationPoint;
  dropoffLocation: LocationPoint;
}