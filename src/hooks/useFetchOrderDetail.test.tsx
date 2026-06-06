import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFetchOrderDetail } from './useFetchOrderDetail';
import { cargoService } from '../api/cargoService';
import { type ReactNode } from 'react';

// Interceptamos el servicio de la API para controlarlo
vi.mock('../api/cargoService', () => ({
  cargoService: {
    getOrderDetail: vi.fn(),
  },
}));

// Creamos un proveedor de React Query limpio para que la prueba no arroje errores de contexto
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => {
  const testQueryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Hook useFetchOrderDetail', () => {
  it('Debe retornar un estado deshabilitado (undefined data) si no se pasa orderId', () => {
    const { result } = renderHook(() => useFetchOrderDetail(undefined), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(cargoService.getOrderDetail).not.toHaveBeenCalled();
  });

  it('Debe invocar a cargoService y mapear los datos si se proporciona un orderId', async () => {
    // Simulamos la respuesta de la API
    const mockApiResponse = {
      status: 200,
      result: {
        _id: '123',
        order_number: 'TEST-ORDER',
        reference_number: 'REF-1',
        start_date: 1780694700000,
        end_date: 1780694700000,
        manager: { nickname: 'Juan', email: 'juan@test.com', telephone: '123' },
        pricing: { total: 100 },
        cargo: { description: 'Carga test', weigth: [10], weight_unit: 'kg' },
        destinations: [],
        status_list: { pickup: [], dropoff: [] }
      }
    };

    vi.mocked(cargoService.getOrderDetail).mockResolvedValueOnce(mockApiResponse as any);
    const { result } = renderHook(() => useFetchOrderDetail('123'), { wrapper });
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(cargoService.getOrderDetail).toHaveBeenCalledTimes(1);
    expect(result.current.data?.orderNumber).toBe('TEST-ORDER');
  });
});