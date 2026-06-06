import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchOrders } from '../hooks/useFetchOrders';
import OrderCard from '../components/orders/OrderCard';
import OrderDetailPanel from '../components/details/OrderDetailPanel';

type TabType = 'Upcoming' | 'Completed' | 'Past';

export default function DashboardPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('Upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const { data: orders, isLoading: loadingList } = useFetchOrders();

  // Declaración única
  const isDetailOpen = !!orderId;
  const loadingDetail = false; // Cambia esto si usas useFetchOrderDetail

  // 1. Encontrar la orden seleccionada optimizada con useMemo
  const selectedOrder = useMemo(() => {
    if (!orders || !orderId) return null;
    return orders.find((o) => o.id === orderId) ?? null;
  }, [orders, orderId]);

  // 2. Lógica de filtrado
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    let filtered = orders;

    filtered = filtered.filter((order) => {
      const statusStr = order.statusText.toLowerCase();
      if (activeTab === 'Upcoming') return !statusStr.includes('completada') && !statusStr.includes('entregada');
      if (activeTab === 'Completed') return statusStr.includes('completada') || statusStr.includes('entregada');
      if (activeTab === 'Past') return statusStr.includes('completada') || statusStr.includes('cancelada');
      return true;
    });

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((order) => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [orders, activeTab, searchTerm]);

  // 3. Construir los detalles de la orden activa (Unificada)
  const activeOrderDetail = useMemo(() => {
    if (!selectedOrder) return null;

    const buildTimeline = (status: string) => {
      const steps = [
        "Created Order",
        "Accepted Order",
        "Pickup Started",
        "Pickup Completed",
        "Out for Delivery",
        "Delivery Completed",
        "Order Completed"
      ];

      let completed = 0;

      switch (status) {
        case "Orden Asignada":
          completed = 2;
          break;
        case "Recolección completada":
          completed = 4;
          break;
        case "Entrega completada":
          completed = 6;
          break;
        default:
          completed = 1;
      }

      return steps.map((title, index) => ({
        title,
        isCompleted: index < completed
      }));
    };

    const timeline = buildTimeline(selectedOrder.statusText);

    return {
      id: selectedOrder.id,
      orderNumber: selectedOrder.orderNumber,
      referenceNumber: selectedOrder.orderNumber,

      managerName: "No disponible",
      managerEmail: "",
      managerPhone: "",

      driverName: "Driver",
      driverImageUrl: null,

      cargoDescription: "Sin descripción",
      weight: 0,
      weightUnit: "kg",
      totalCost: 0,

      pickupLocation: selectedOrder.pickupLocation,
      dropoffLocation: selectedOrder.dropoffLocation,

      // Se divide el arreglo en las dos partes que necesita tu componente
      pickupTimeline: timeline.slice(0, 4),
      dropoffTimeline: timeline.slice(4)
    };
  }, [selectedOrder]);

  return (
    <div className="relative h-screen w-full bg-[#050505] text-white font-sans overflow-hidden">
      <section className="h-full w-full flex flex-col bg-[#0a0a0a]">
        {/* Cabecera, Tabs y Buscador */}
        <div className="p-6 pb-2 border-b border-[#1f1f1f] max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <button className="text-xl">&lt;</button>
            <h1 className="text-lg font-semibold tracking-wide">Cargo Orders</h1>
            <button
              onClick={() => setOpen(true)}
              className="relative p-2 hover:bg-gray-100 hover:text-black rounded-full transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                style={{ color: "#FACC15" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </button>

            {/* Modal de notificaciones */}
            {open && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg w-80 p-5 text-black">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Notificaciones</h2>
                    <button
                      onClick={() => setOpen(false)}
                      className="text-gray-500 hover:text-black font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay nuevas notificaciones.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-around space-x-6 text-sm mb-6 font-medium">
            {(['Upcoming', 'Completed', 'Past'] as TabType[]).map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`pb-1 transition-colors ${activeTab === tab ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search order number..." 
              className="w-full bg-[#111] border border-[#222] rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors" 
            />
          </div>
        </div>

        {/* Lista de Tarjetas */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505]">
          <div className="max-w-3xl mx-auto p-6 space-y-4">
            {loadingList ? (
              <p className="text-center text-gray-500 mt-10">Loading orders...</p>
            ) : filteredOrders.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">No orders to display.</p>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => navigate(`/tracking/${order.id}`)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CARGO DETAILS */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full md:w-[500px] bg-[#050505] border-l border-[#1f1f1f] shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto custom-scrollbar ${isDetailOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {loadingDetail ? (
          <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>
        ) : activeOrderDetail ? (
          <OrderDetailPanel detail={activeOrderDetail} />
        ) : null}
      </div>

      {/* Overlay para cerrar el detalle */}
      {isDetailOpen && (
        <div
          onClick={() => navigate('/tracking')}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        />
      )}
    </div>
  );
}