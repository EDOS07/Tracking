import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OrderCard from './OrderCard';
import { type OrderSummary } from '../../types/models/orderSummary';

describe('Componente OrderCard', () => {
  
  // Creamos un mock base de nuestra orden
  const mockOrder: OrderSummary = {
    id: 'test-1',
    orderNumber: 'XJ9000',
    transportType: 'FTL',
    statusText: 'Orden Asignada',
    startDate: new Date(),
    endDate: new Date(),
    pickupLocation: {
      id: 'pickup',
      address: 'Calle Reforma 222, Ciudad de México',
      // Para probar el temporizador, le damos 1 hora en el futuro
      startDate: new Date(new Date().getTime() + 3600000), 
      endDate: new Date()
    },
    dropoffLocation: {
      id: 'dropoff',
      address: 'Avenida Siempre Viva 123, Monterrey',
      startDate: new Date(),
      endDate: new Date()
    }
  };

  it('Debe renderizar la información principal correctamente', () => {
    // Espiamos la función onClick
    const handleClick = vi.fn();
    
    render(<OrderCard order={mockOrder} onClick={handleClick} />);

    // Verificamos elementos visibles
    expect(screen.getByText('#XJ9000')).toBeInTheDocument();
    expect(screen.getByText('FTL')).toBeInTheDocument();
    expect(screen.getByText('Orden Asignada')).toBeInTheDocument();
    
    // Verificamos que el `.split(',')[0]` hizo su trabajo en el título
    expect(screen.getByText('Calle Reforma 222')).toBeInTheDocument();
    expect(screen.getByText('Avenida Siempre Viva 123')).toBeInTheDocument();
  });

  it('Debe ejecutar la navegación (onClick) al hacer clic en la tarjeta', () => {
    const handleClick = vi.fn();
    render(<OrderCard order={mockOrder} onClick={handleClick} />);
    
    // Encontramos el botón de Resume (o podríamos hacer clic en el contenedor principal)
    const resumeButton = screen.getByText('Resume');
    fireEvent.click(resumeButton);

    // Verificamos que se llamó a la función
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Debe mostrar el botón activo de "Its time for pickup" si la fecha ya pasó', () => {
    // Clonamos el mock pero con la fecha de pickup en el pasado
    const orderInPast = {
      ...mockOrder,
      pickupLocation: {
        ...mockOrder.pickupLocation,
        // 10 minutos en el pasado
        startDate: new Date(new Date().getTime() - 600000) 
      }
    };

    render(<OrderCard order={orderInPast} onClick={vi.fn()} />);

    // Buscamos el botón activo
    const activeButton = screen.getByText('Its time for pickup');
    
    expect(activeButton).toBeInTheDocument();
    expect(activeButton).not.toBeDisabled();
  });

  it('Debe detener la propagación del clic al presionar "Its time for pickup"', () => {
    const handleCardClick = vi.fn();
    
    const orderInPast = {
      ...mockOrder,
      pickupLocation: {
        ...mockOrder.pickupLocation,
        startDate: new Date(new Date().getTime() - 60000)
      }
    };

    render(<OrderCard order={orderInPast} onClick={handleCardClick} />);

    // Hacemos clic específicamente en el botón de navegación
    const navigateButton = screen.getByText('Its time for pickup');
    fireEvent.click(navigateButton);

    // Como tiene e.stopPropagation(), el onClick de la tarjeta padre NO debió llamarse
    expect(handleCardClick).not.toHaveBeenCalled();
  });
});