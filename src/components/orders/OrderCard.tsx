import { useState, useEffect } from 'react';
import { type OrderSummary } from '../../types/models/orderSummary';

interface Props {
  order: OrderSummary;
  onClick: () => void;
}

export default function OrderCard({ order, onClick }: Props) {
  // --- Lógica del Temporizador ---
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const startTime = order.pickupLocation.startDate.getTime();
      const difference = startTime - now;

      if (difference <= 0) {
        setTimeLeft(0);
        setIsTimeUp(true);
      } else {
        setTimeLeft(difference);
        setIsTimeUp(false);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [order.pickupLocation.startDate]);

  const formatTimeLeft = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNavegarClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que abra el panel de detalles al hacer click en el botón de acción
    console.log("Navegar");
  };

  // --- Formateadores Visuales ---
  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear().toString().slice(-2);
    return `${d}/${m}/${y}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const isAssigned = order.statusText.toLowerCase().includes('asignada');

  return (
    <div 
      onClick={onClick}
      className="w-full flex flex-col mb-6 cursor-pointer group"
    >
      {/* Título exterior (Order #ID) */}
      <p className="text-neutral-400 text-sm font-medium mb-3 group-hover:text-neutral-300 transition-colors">
        Order <span className="text-white font-bold group-hover:text-yellow-400 transition-colors">#{order.orderNumber}</span>
      </p>

      {/* Tarjeta Oscura Principal */}
      <div className="bg-[#111111] border border-neutral-800 rounded-[20px] p-5 flex flex-col relative group-hover:bg-[#151515] group-hover:border-neutral-700 transition-all duration-300">
        
        {/* Header: Tipo de Transporte y Status */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {/* Ícono de Camión */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <span className="text-white font-bold tracking-wide">{order.transportType}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isAssigned ? 'bg-neutral-500' : 'bg-blue-500'}`}></span>
            <span className="text-xs font-medium text-neutral-300 capitalize">{order.statusText}</span>
          </div>
        </div>

        {/* Línea Divisoria Sólida */}
        <hr className="border-neutral-800 mb-6 group-hover:border-neutral-700 transition-colors" />

        {/* Body: Timeline de Rutas Punteado */}
        <div className="relative flex flex-col gap-6 mb-6">
          {/* Línea vertical discontinua */}
          <div className="absolute top-6 bottom-6 left-[11px] w-px border-l border-dashed border-neutral-600"></div>

          {/* Pickup Dinámico */}
          <div className="flex justify-between items-start z-10 w-full relative">
            <div className="flex gap-3">
              <div className="bg-[#111111] group-hover:bg-[#151515] transition-colors py-1">
                {/* Ícono de Caja */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-yellow-400 bg-[#111111] group-hover:bg-[#151515] transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 8.25-7.5 2.75M21 8.25v7.5l-7.5 2.75m7.5-10.25L12 5.25 4.5 8.25m7.5-3v10.5m0 0L4.5 12.75m7.5 3 7.5-2.75M4.5 12.75V8.25m0 0L12 5.25" />
                </svg>
              </div>
              <div className="flex flex-col pt-1">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Pickup</span>
                {/* Título dinámico recortado */}
                <span className="text-sm font-bold text-white leading-tight">
                  {order.pickupLocation.address.split(',')[0] || 'Recolección'}
                </span>
                {/* Dirección completa dinámica */}
                <span className="text-xs text-neutral-400 mt-1 max-w-[200px] truncate" title={order.pickupLocation.address}>
                  {order.pickupLocation.address}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end text-right pt-1">
              <span className="text-xs text-neutral-400">{formatDate(order.pickupLocation.startDate)}</span>
              <span className="text-sm font-bold text-white mt-0.5">{formatTime(order.pickupLocation.startDate)}</span>
            </div>
          </div>

          {/* Dropoff Dinámico */}
          <div className="flex justify-between items-start z-10 w-full relative">
            <div className="flex gap-3">
              <div className="bg-[#111111] group-hover:bg-[#151515] transition-colors py-1">
                {/* Ícono de Pin */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white bg-[#111111] group-hover:bg-[#151515] transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <div className="flex flex-col pt-1">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Dropoff</span>
                {/* Título dinámico recortado */}
                <span className="text-sm font-bold text-white leading-tight">
                  {order.dropoffLocation.address.split(',')[0] || 'Entrega'}
                </span>
                {/* Dirección completa dinámica */}
                <span className="text-xs text-neutral-400 mt-1 max-w-[200px] truncate" title={order.dropoffLocation.address}>
                  {order.dropoffLocation.address}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end text-right pt-1">
              <span className="text-xs text-neutral-400">{formatDate(order.dropoffLocation.startDate)}</span>
              <span className="text-sm font-bold text-white mt-0.5">{formatTime(order.dropoffLocation.startDate)}</span>
            </div>
          </div>
        </div>

        {/* Footer: Temporizador en texto y Botón Resume */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-800 group-hover:border-neutral-700 transition-colors">
          
          {/* Contador de Tiempo Dinámico basado en pickupLocation */}
          {!isTimeUp ? (
            <p className="text-xs font-medium text-neutral-400">
              Start pickup in <span className="text-yellow-400 font-bold">{formatTimeLeft(timeLeft)}</span>
            </p>
          ) : (
            <button 
              onClick={handleNavegarClick}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full text-xs transition-all active:scale-95 shadow"
            >
              Its time for pickup
            </button>
          )}

          {/* Botón de Resume */}
          <button 
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-5 rounded-full flex items-center justify-center gap-2 transition-colors text-xs shadow"
          >
            Resume
            {/* Ícono de Ojo */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}