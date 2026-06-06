import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MainLayout } from './MainLayout';

describe('Componente MainLayout', () => {
  it('Debe renderizar la cabecera (Header) correctamente', () => {
    // Renderizamos el layout pasándole un "hijo" de prueba
    render(
      <MainLayout>
        <div>Página de prueba</div>
      </MainLayout>
    );

    // Verificamos que la marca y el texto de control estén en la pantalla
    expect(screen.getByText('BEGO LOGISTICS')).toBeInTheDocument();
    expect(screen.getByText('Control Panel')).toBeInTheDocument();
  });

  it('Debe renderizar el contenido hijo (children) dentro del main', () => {
    render(
      <MainLayout>
        <h1 data-testid="test-child">Contenido inyectado</h1>
      </MainLayout>
    );

    // Verificamos que el contenido que pasamos como "children" realmente aparezca
    const childElement = screen.getByTestId('test-child');
    expect(childElement).toBeInTheDocument();
    expect(childElement.textContent).toBe('Contenido inyectado');
  });
});