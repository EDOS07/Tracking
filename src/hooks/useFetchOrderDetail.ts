import { useQuery } from '@tanstack/react-query';
import { cargoService } from '../api/cargoService';
import { orderMapper } from '../mappers/orderMapper';
import { type OrderDetail } from '../types/models/orderDetail';


export function useFetchOrderDetail(orderId: string | undefined) {
  return useQuery<OrderDetail | null>({

    queryKey: ['orders', 'detail', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      

      const responseBody = await cargoService.getOrderDetail();
      
      return orderMapper.toDetail(responseBody);
    },
    enabled: !!orderId,
  });
}