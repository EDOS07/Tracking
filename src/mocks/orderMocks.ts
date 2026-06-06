import { type OrderDetail } from '../types/models/orderDetail';

export const mockOrderCreated: OrderDetail = {
  id: 'order-001',
  orderNumber: 'NW8822KL',
  referenceNumber: 'REF-NEW',
  managerName: 'Ana López',
  managerEmail: 'contacto@techgrowthlogistic.com',
  managerPhone: '5559990000',
  driverName: 'Pendiente de asignación',
  driverImageUrl: '', // Probará el fallback del SVG neutro
  totalCost: 850,
  weight: 500,
  cargoDescription: 'Refacciones automotrices',
  weightUnit: 'kg',
  pickupLocation: {
    id: 'p1',
    address: 'Av. Gustavo Baz 45, Tlalnepantla, Estado de México',
    startDate: new Date(new Date().getTime() + 86400000 * 2), // 2 días en el futuro
    endDate: new Date(new Date().getTime() + 86400000 * 2)
  },
  dropoffLocation: {
    id: 'd1',
    address: 'Parque Industrial Milimex, Apodaca, Nuevo León',
    startDate: new Date(new Date().getTime() + 86400000 * 3), // 3 días en el futuro
    endDate: new Date(new Date().getTime() + 86400000 * 3)
  },
  timeline: [
    { title: 'Orden creada', isCompleted: true },
    { title: 'Asignación de transporte', isCompleted: false },
    { title: 'En camino a recolección', isCompleted: false },
    { title: 'Viaje en tránsito', isCompleted: false },
    { title: 'Mercancía entregada', isCompleted: false }
  ]
};

export const mockOrderInTransit: OrderDetail = {
  id: 'order-002',
  orderNumber: 'TR4599XP',
  referenceNumber: 'REF-MID',
  managerName: 'Roberto Gómez',
  managerEmail: 'contacto@techgrowthlogistic.com',
  managerPhone: '5553331111',
  driverName: 'Carlos Mendoza',
  driverImageUrl: 'https://i.pravatar.cc/150?u=carlos', // Imagen válida
  totalCost: 12400,
  weight: 15,
  cargoDescription: 'Bobinas de acero',
  weightUnit: 'ton',
  pickupLocation: {
    id: 'p2',
    address: 'Carretera Miguel Alemán Km 14, Monterrey',
    startDate: new Date(new Date().getTime() - 86400000), // Ayer (ya pasó)
    endDate: new Date(new Date().getTime() - 86400000)
  },
  dropoffLocation: {
    id: 'd2',
    address: 'Puerto Interior, Silao, Guanajuato',
    startDate: new Date(new Date().getTime() + 43200000), // En 12 horas
    endDate: new Date(new Date().getTime() + 43200000)
  },
  timeline: [
    { title: 'Orden creada', isCompleted: true },
    { title: 'Asignación de transporte', isCompleted: true },
    { title: 'Recolección finalizada', isCompleted: true },
    { title: 'Viaje en tránsito', isCompleted: true },
    { title: 'Mercancía entregada', isCompleted: false }
  ]
};

export const mockOrderCompleted: OrderDetail = {
  id: 'order-003',
  orderNumber: 'DN1122ZZ',
  referenceNumber: 'REF-DONE',
  managerName: 'Elena Torres',
  managerEmail: 'contacto@techgrowthlogistic.com',
  managerPhone: '5557778888',
  driverName: 'Miguel Ángel Ruiz',
  driverImageUrl: 'https://i.pravatar.cc/150?u=miguel',
  totalCost: 3200,
  weight: 1200,
  cargoDescription: 'Pallets de Electrónica',
  weightUnit: 'kg',
  pickupLocation: {
    id: 'p3',
    address: 'Zona Libre de Colón, Panamá', // Para probar direcciones internacionales
    startDate: new Date(new Date().getTime() - 86400000 * 5), // Hace 5 días
    endDate: new Date(new Date().getTime() - 86400000 * 5)
  },
  dropoffLocation: {
    id: 'd3',
    address: 'Aduana Pantaco, Azcapotzalco, CDMX',
    startDate: new Date(new Date().getTime() - 86400000 * 2), // Hace 2 días
    endDate: new Date(new Date().getTime() - 86400000 * 2)
  },
  timeline: [
    { title: 'Orden creada', isCompleted: true },
    { title: 'Asignación de transporte', isCompleted: true },
    { title: 'Recolección finalizada', isCompleted: true },
    { title: 'Viaje en tránsito', isCompleted: true },
    { title: 'Mercancía entregada', isCompleted: true }
  ]
};

export const mockOrderEdgeCase: OrderDetail = {
  id: 'order-004',
  orderNumber: 'EXTREME-9999999999',
  referenceNumber: 'REF-SUPER-LONG-REFERENCE-NUMBER-0001',
  managerName: 'Juan Carlos Francisco de la Cruz Mendieta',
  managerEmail: 'contacto@techgrowthlogistic.com',
  managerPhone: '5551234567890123', // Teléfono anormalmente largo
  driverName: 'Conductor con un nombre exageradamente largo para romper la UI',
  driverImageUrl: 'https://url-rota.com/imagen-que-no-existe.jpg', // Para forzar el evento onError del `img`
  totalCost: 999999.99,
  weight: 99999,
  cargoDescription: 'Carga con descripción súper larga. Materiales peligrosos clase 3, corrosivos, requiere escolta armada y permisos especiales de la SCT.',
  weightUnit: 'Libras',
  pickupLocation: {
    id: 'p4',
    address: 'Callejón de los Milagros Ext. 12345, Edificio B, Piso 14, Oficina 1402, Colonia Centro Histórico, Alcaldía Cuauhtémoc, Ciudad de México, CDMX, C.P. 06000',
    startDate: new Date(), // Justo en este momento
    endDate: new Date()
  },
  dropoffLocation: {
    id: 'd4',
    address: 'Carretera, Sin Número', // Dirección anormalmente corta
    startDate: new Date(),
    endDate: new Date()
  },
  timeline: [
    { title: 'Paso 1 con un texto ridículamente largo que seguramente hará que el texto baje a dos líneas en el diseño de la tarjeta', isCompleted: true },
    { title: 'Paso 2', isCompleted: false }
  ]
};