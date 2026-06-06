import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useNavigationTimer } from './useNavigationTimer';

describe('Hook useNavigationTimer', () => {

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Debe mostrar el tiempo restante formateado si la fecha está en el futuro', () => {
    // Congelamos el reloj exactamente en una hora ficticia
    const mockNow = new Date('2026-06-06T10:00:00').getTime();
    vi.setSystemTime(mockNow);

    // Definimos que el evento será en 1 hora, 5 minutos y 30 segundos
    const futureDate = new Date(mockNow + (1000 * 60 * 60 * 1) + (1000 * 60 * 5) + (1000 * 30));

    const { result } = renderHook(() => useNavigationTimer({ startDate: futureDate }));

    expect(result.current.isEnabled).toBe(false);
    expect(result.current.remainingTime).toBe('01:05:30');
  });

  it('Debe actualizar el tiempo restante al pasar un segundo', () => {
    const mockNow = new Date('2026-06-06T10:00:00').getTime();
    vi.setSystemTime(mockNow);

    const futureDate = new Date(mockNow + 10000); 

    const { result } = renderHook(() => useNavigationTimer({ startDate: futureDate }));

    expect(result.current.remainingTime).toBe('00:00:10');

    act(() => {

      vi.advanceTimersByTime(1000); 
    });

    expect(result.current.remainingTime).toBe('00:00:09');
  });

  it('Debe habilitar la navegación si la fecha objetivo ya pasó', () => {
    const mockNow = new Date('2026-06-06T10:00:00').getTime();
    vi.setSystemTime(mockNow);

    // Evento hace 5 segundos
    const pastDate = new Date(mockNow - 5000); 

    const { result } = renderHook(() => useNavigationTimer({ startDate: pastDate }));

    expect(result.current.isEnabled).toBe(true);
    expect(result.current.remainingTime).toBe('Its time for pickup');
  });
});