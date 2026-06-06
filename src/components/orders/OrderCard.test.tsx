import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OrderCard from './OrderCard';
import { type OrderSummary } from '../../types/models/orderSummary';

describe('Componente OrderCard', () => {
  
  // mock de nuestra orden
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
    const handleClick = vi.fn();
    
    render(<OrderCard order={mockOrder} onClick={handleClick} />);

    expect(screen.getByText('#XJ9000')).toBeInTheDocument();
    expect(screen.getByText('FTL')).toBeInTheDocument();
    expect(screen.getByText('Orden Asignada')).toBeInTheDocument();
    expect(screen.getByText('Calle Reforma 222')).toBeInTheDocument();
    expect(screen.getByText('Avenida Siempre Viva 123')).toBeInTheDocument();
  });

  it('Debe ejecutar la navegación (onClick) al hacer clic en la tarjeta', () => {
    const handleClick = vi.fn();
    render(<OrderCard order={mockOrder} onClick={handleClick} />);
    
    const resumeButton = screen.getByText('Resume');
    fireEvent.click(resumeButton);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Debe mostrar el botón activo de "Its time for pickup" si la fecha ya pasó', () => {

    const orderInPast = {
      ...mockOrder,
      pickupLocation: {
        ...mockOrder.pickupLocation,
        startDate: new Date(new Date().getTime() - 600000) 
      }
    };

    render(<OrderCard order={orderInPast} onClick={vi.fn()} />);

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

    const navigateButton = screen.getByText('Its time for pickup');
    fireEvent.click(navigateButton);

    expect(handleCardClick).not.toHaveBeenCalled();
  });
});