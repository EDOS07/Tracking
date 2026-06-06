import { useQuery } from '@tanstack/react-query';
import { cargoService } from '../api/cargoService';
import { orderMapper } from '../mappers/orderMapper';
import { type OrderSummary } from '../types/models/orderSummary';

export function useFetchOrders() {
  return useQuery({
    queryKey: ['orders', 'upcoming'],
    queryFn: async () => {
      const dtos = await cargoService.getUpcomingOrders();

      console.log('DTOs', dtos);

      const mapped = orderMapper.toSummaryList(dtos);

      console.log('Mapped', mapped);

      return mapped;
    }
  });
}

// export function useFetchOrders() {
//   return useQuery<OrderSummary[]>({
//     queryKey: ['orders', 'upcoming'],
//     queryFn: async () => {
//       const dtos = await cargoService.getUpcomingOrders();
//       return orderMapper.toSummaryList(dtos);
//     }
//   });
// }