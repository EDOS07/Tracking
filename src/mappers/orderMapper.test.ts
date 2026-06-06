import { describe, it, expect } from 'vitest';
import { orderMapper } from './orderMapper';
import { type OrderResponseDto, type OrderDetailDto } from '../types/dto/order.dto';

describe('orderMapper', () => {
  it('Debe mapear correctamente un DTO complejo a un OrderDetail', () => {
    // 1. Arrange (Preparar): Simulamos la respuesta exacta de tu API
    const mockDto: OrderResponseDto<OrderDetailDto> = {
      status: 200,
      result: {
        _id: '624b5714296f8d9a820d01b3',
        order_number: 'ID7PJQBJ',
        reference_number: 'AB100',
        start_date: 1780694700000,
        end_date: 1781209680000,
        manager: {
          nickname: 'Julio Tapia',
          email: 'juliocesar@begomx.com',
          telephone: '+5227653696'
        },
        driver: {
          nickname: 'Federico driver',
          thumbnail: 'https://ejemplo.com/avatar.jpg'
        },
        cargo: {
          description: 'Prueba de Carga',
          weigth: [1000],
          weight_unit: 'kg'
        },
        pricing: {
          total: 1160
        },
        destinations: [
          { address: 'Perif. Blvd. Manuel Ávila Camacho 3130, Tlalnepantla', startDate: 1780694700000, endDate: 1780694700000 },
          { address: 'Mariano Matamoros, Nuevo Laredo', startDate: 1781209680000, endDate: 1781209680000 }
        ],
        status_list: {
          pickup: [
            { status: 'Orden creada', active: true },
            { status: 'Recolección iniciada', active: false }
          ],
          dropoff: [
            { status: 'Entrega iniciada', active: false }
          ]
        }
      }
    };

    // 2. Act (Actuar): Ejecutamos la función
    const result = orderMapper.toDetail(mockDto);

    // 3. Assert (Afirmar): Validamos que los datos se extrajeron correctamente
    expect(result.id).toBe('624b5714296f8d9a820d01b3');
    expect(result.orderNumber).toBe('ID7PJQBJ');
    expect(result.managerName).toBe('Julio Tapia');
    expect(result.driverImageUrl).toBe('https://ejemplo.com/avatar.jpg');
    expect(result.totalCost).toBe(1160);
    expect(result.weight).toBe(1000);
    
    // Validamos las locaciones
    expect(result.pickupLocation.address).toBe('Perif. Blvd. Manuel Ávila Camacho 3130, Tlalnepantla');
    expect(result.dropoffLocation.address).toBe('Mariano Matamoros, Nuevo Laredo');
    
    // Validamos que el timeline combinó pickup y dropoff (2 + 1 = 3 pasos)
    expect(result.timeline).toHaveLength(3);
    expect(result.timeline[0].isCompleted).toBe(true);  // Orden creada
    expect(result.timeline[1].isCompleted).toBe(false); // Recolección iniciada
  });

  it('Debe lanzar un error si el payload viene vacío', () => {
    const invalidDto = { status: 404, result: null } as unknown as OrderResponseDto<OrderDetailDto>;
    
    // Validamos el manejo de errores
    expect(() => orderMapper.toDetail(invalidDto)).toThrowError('No se encontraron datos de detalle');
  });
});