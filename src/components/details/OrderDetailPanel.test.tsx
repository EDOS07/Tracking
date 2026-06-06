import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import OrderDetailPanel from './OrderDetailPanel';
import { type OrderDetail } from '../../types/models/orderDetail';

// 1. Preparamos un mock robusto basado en tu modelo
const mockDetail: OrderDetail = {
  id: '123',
  orderNumber: 'ID7PJQBJ',
  referenceNumber: 'REF-001',
  managerName: 'Julio Tapia',
  managerEmail: 'contacto@techgrowthlogistic.com', 
  managerPhone: '5551234567',
  driverName: 'Federico',
  driverImageUrl: '',
  totalCost: 1500,
  weight: 1000,
  cargoDescription: 'Materiales de construcción',
  weightUnit: 'kg',
  pickupLocation: {
    id: 'p1',
    address: 'Perif. Blvd. Manuel Ávila Camacho 3130, Tlalnepantla',
    startDate: new Date('2026-06-05T15:25:00'),
    endDate: new Date('2026-06-05T15:25:00')
  },
  dropoffLocation: {
    id: 'd1',
    address: 'Mariano Matamoros, Sector Centro, Nuevo Laredo',
    startDate: new Date('2026-06-11T14:21:00'),
    endDate: new Date('2026-06-11T14:21:00')
  },
  timeline: [
    { title: 'Orden creada', isCompleted: true },
    { title: 'Asignación de transporte', isCompleted: true },
  ]
};

// Envolvemos el componente en BrowserRouter porque usa `useNavigate`
const renderPanel = (detail: OrderDetail) => {
  return render(
    <BrowserRouter>
      <OrderDetailPanel detail={detail} />
    </BrowserRouter>
  );
};

describe('Componente OrderDetailPanel', () => {

  it('Debe renderizar la información principal del panel', () => {
    renderPanel(mockDetail);

    // Verificamos cabecera y títulos principales
    expect(screen.getByText('Cargo Details')).toBeInTheDocument();
    expect(screen.getByText('Order #ID7PJQBJ')).toBeInTheDocument();
    expect(screen.getByText('Referencia REF-001')).toBeInTheDocument();
    expect(screen.getByText('Federico')).toBeInTheDocument();
  });

  it('Debe alternar los datos dinámicos al cambiar de pestaña (Pickup/Dropoff)', () => {
    renderPanel(mockDetail);

    // Por defecto, debe mostrar "Pickup Data" en el acordeón inferior
    expect(screen.getByText('Pickup Data')).toBeInTheDocument();

    // Buscamos el ítem de Dropoff en la línea de tiempo superior y le damos clic
    // Usamos getAllByText porque la palabra "Dropoff" puede aparecer varias veces
    const dropoffTab = screen.getByText('Dropoff', { selector: 'p' });
    fireEvent.click(dropoffTab);

    // El título del acordeón debió cambiar a Dropoff Data
    expect(screen.getByText('Dropoff Data')).toBeInTheDocument();
  });

  it('El botón "Track Order" debe estar deshabilitado si el timeline tiene menos de 3 pasos', () => {
    renderPanel(mockDetail); // El mock inicial tiene solo 2 pasos en el timeline

    const trackButton = screen.getByText('Track Order');
    
    // Verificamos que el botón existe, está deshabilitado y tiene la clase de opacidad
    expect(trackButton).toBeInTheDocument();
    expect(trackButton).toBeDisabled();
    expect(trackButton).toHaveClass('opacity-50');
  });

  it('El botón "Track Order" debe habilitarse si la orden avanza', () => {
    const activeDetail = {
      ...mockDetail,
      timeline: [
        ...mockDetail.timeline,
        { title: 'En tránsito', isCompleted: true }
      ]
    };

    renderPanel(activeDetail);

    const trackButton = screen.getByText('Track Order');
    
    // Ahora debe estar habilitado
    expect(trackButton).not.toBeDisabled();
    expect(trackButton).toHaveClass('hover:bg-yellow-500');
  });
});