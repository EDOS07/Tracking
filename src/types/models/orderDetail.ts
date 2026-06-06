export interface TimelineStep {
  title: string;
  isCompleted: boolean;
}

export interface LocationPoint {
  id: string;
  address: string;
  startDate: Date;
  endDate: Date;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  referenceNumber: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  pickupLocation: LocationPoint;
  dropoffLocation: LocationPoint;
  driverName: string;
  driverImageUrl: string | null;
  cargoDescription: string;
  weight: number;
  weightUnit: string;
  totalCost: number;
  pickupTimeline: TimelineStep[];
  dropoffTimeline: TimelineStep[];
}