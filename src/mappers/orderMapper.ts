import { type OrderSummary } from '../types/models/orderSummary';
import { type OrderDetail, type TimelineStep } from '../types/models/orderDetail';
import {
  type OrderResponseDto,
  type OrderSummaryDto,
  type OrderDetailDto
} from '../types/dto/order.dto';

const statusTranslations: Record<string, string> = {
  "Orden creada": "Created Order",
  "Orden asignada": "Accepted Order",
  "Recolección iniciada": "Pickup Started",
  "Recolección completada": "Pickup Completed",
  "Entrega iniciada": "Out for Delivery",
  "Entrega completada": "Delivery Completed",
  "Orden completada": "Order Completed"
};

export const orderMapper = {

  toSummaryList(data: OrderResponseDto<OrderSummaryDto[]>): OrderSummary[] {
    const list = data?.result;
    if (!Array.isArray(list)) return [];

    return list.map((dto) => {
      const pickup = dto.destinations?.find((d) => d.nickname === 'Recolección');
      const dropoff = dto.destinations?.find((d) => d.nickname === 'Entrega');

      return {
        id: dto._id,
        status: dto.status,
        orderNumber: dto.order_number,
        transportType: dto.type || 'FTL',
        statusText: dto.status_string,
        startDate: new Date(dto.start_date),
        endDate: new Date(dto.end_date),
        pickupLocation: {
          id: 'pickup',
          address: pickup?.address || 'Sin dirección',
          startDate: new Date(pickup?.start_date || dto.start_date),
          endDate: new Date(pickup?.end_date || dto.start_date),
        },
        dropoffLocation: {
          id: 'dropoff',
          address: dropoff?.address || 'Sin dirección',
          startDate: new Date(dropoff?.start_date || dto.end_date),
          endDate: new Date(dropoff?.end_date || dto.end_date),
        }
      };
    });
  },
  
  toDetail(data: OrderResponseDto<OrderDetailDto>): OrderDetail {
    const dto = data?.result;
    if (!dto) throw new Error("No se encontraron datos de detalle");

    // Mapeo y traducción separados
    const pickupTimeline: TimelineStep[] = (dto.status_list?.pickup || []).map((s) => ({
      title: statusTranslations[s.status] || s.status,
      isCompleted: s.active
    }));
    const dropoffTimeline: TimelineStep[] = (dto.status_list?.dropoff || []).map((s) => ({
      title: statusTranslations[s.status] || s.status,
      isCompleted: s.active
    }));

    const pickupData = dto.destinations?.[0];
    const dropoffData = dto.destinations?.[1];

    return {
      id: dto._id,
      orderNumber: dto.order_number,
      referenceNumber: dto.reference_number || 'N/A',
      managerName: dto.manager?.nickname || 'Sin asignar',
      managerEmail: dto.manager?.email || '',
      managerPhone: dto.manager?.telephone || '',
      driverName: dto.driver?.nickname || 'Sin conductor',
      driverImageUrl: dto.driver?.thumbnail || null,
      cargoDescription: dto.cargo?.description || 'Sin descripción',
      weight: dto.cargo?.weigth?.[0] || 0,
      weightUnit: dto.cargo?.weight_unit || 'kg',
      totalCost: dto.pricing?.total || 0,
      
      pickupTimeline,
      dropoffTimeline,

      pickupLocation: {
        id: 'pickup',
        address: pickupData?.address || 'Sin dirección',
        startDate: new Date(pickupData?.startDate || dto.start_date),
        endDate: new Date(pickupData?.endDate || dto.start_date),
      },
      dropoffLocation: {
        id: 'dropoff',
        address: dropoffData?.address || 'Sin dirección',
        startDate: new Date(dropoffData?.startDate || dto.end_date),
        endDate: new Date(dropoffData?.endDate || dto.end_date),
      }
    };
  }
};