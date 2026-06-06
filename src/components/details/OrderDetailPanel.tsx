import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type OrderDetail } from '../../types/models/orderDetail';

interface Props {
  detail: OrderDetail;
}

export default function OrderDetailPanel({ detail }: Props) {
  const navigate = useNavigate();

  // Estados de la UI
  const [activeTab, setActiveTab] = useState<'pickup' | 'dropoff'>('pickup');
  const [isExpanded, setIsExpanded] = useState(true);
  const [imgError, setImgError] = useState(false);

  // Componente del Avatar Neutro (Se muestra si no hay imagen o si el enlace está roto)
  const NeutralAvatarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="w-10 h-10 text-neutral-500"
    >
      <path
        fillRule="evenodd"
        d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-5-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 9c-1.825 0-3.422.977-4.295 2.437A5.49 5.49 0 0 0 8 13.5a5.49 5.49 0 0 0 4.294-2.063A4.997 4.997 0 0 0 8 9Z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Validamos si el botón Track Order debe estar habilitado (puedes ajustar esta lógica según necesites)
  const isTrackEnabled = (detail as any).status >= 3 || detail.timeline.length >= 3;

  const handleTrackOrder = () => {
    if (isTrackEnabled) {
      console.log("Track Order");
    }
  };

  return (
    <div className="w-full flex flex-col min-h-full bg-[#050505] text-white font-sans relative">

      {/* Cabecera */}
      <div className="p-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/tracking')}
          className="text-2xl text-neutral-400 hover:text-white transition-colors"
        >
          &lt;
        </button>
        <h2 className="text-lg font-semibold tracking-tight">Cargo Details</h2>
        <div className="relative text-yellow-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full border-2 border-black"></span>
        </div>
      </div>

      <div className="px-6 mb-8">
        <p className="text-xs text-neutral-500 font-medium mb-1">Referencia {detail.referenceNumber}</p>
        <h1 className="text-2xl font-bold tracking-tight">Order #{detail.orderNumber}</h1>
      </div>

      {/* SECCIÓN 1: Switch Pickup/Dropoff */}
      <div className="px-6 relative mb-10">
        <div className="absolute left-[39px] top-6 bottom-6 w-px bg-neutral-800"></div>

        {/* Pickup Item */}
        <div
          onClick={() => setActiveTab('pickup')}
          className={`relative pl-12 mb-8 cursor-pointer transition-opacity ${activeTab === 'pickup' ? 'opacity-100' : 'opacity-40'}`}
        >
          <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-yellow-400 border-4 border-black ring-1 ring-yellow-400 z-10"></div>
          <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-0.5">Pickup</p>
          <p className="text-sm font-bold text-white truncate">
            {detail.pickupLocation.address.split(',')[0] || 'Recolección'}
          </p>
          <p className="text-xs text-neutral-500 truncate mt-0.5" title={detail.pickupLocation.address}>
            {detail.pickupLocation.address}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span className="text-[10px] text-neutral-400 font-medium">Accepted</span>
          </div>
        </div>

        {/* Dropoff Item */}
        <div
          onClick={() => setActiveTab('dropoff')}
          className={`relative pl-12 cursor-pointer transition-opacity ${activeTab === 'dropoff' ? 'opacity-100' : 'opacity-40'}`}
        >
          <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-[#111] border-2 border-neutral-700 z-10"></div>
          <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-0.5">Dropoff</p>
          <p className="text-sm font-bold text-white truncate">
            {detail.dropoffLocation.address.split(',')[0] || 'Entrega'}
          </p>
          <p className="text-xs text-neutral-500 truncate mt-0.5" title={detail.dropoffLocation.address}>
            {detail.dropoffLocation.address}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
            <span className="text-[10px] text-neutral-400 font-medium">On hold</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Avatar Neutro y Timeline Check */}
      <div className="flex-1 bg-[#0f0f0f] border-t border-neutral-800 rounded-t-[40px] px-8 pt-10 pb-10 shadow-inner">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-10 relative">
          <div className="w-20 h-20 rounded-full border-4 border-[#0f0f0f] bg-[#1a1a1a] flex items-center justify-center overflow-hidden shadow-xl">
            {detail.driverImageUrl && !imgError ? (
              <img
                src={detail.driverImageUrl}
                alt="Driver"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <NeutralAvatarIcon />
            )}
          </div>
          <p className="mt-3 text-sm font-bold tracking-wide">{detail.driverName}</p>
          {/* Hora formateada del pickup como extra de diseño */}
          <p className="text-xs text-neutral-500 mt-1">
            {detail.pickupLocation.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-7 relative pl-6">
          <div className="absolute left-[31px] top-2 bottom-2 w-px border-l border-dashed border-neutral-700"></div>

          {detail.timeline.map((step, idx) => (
            <div key={idx} className="flex items-center gap-4 relative">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 shadow ${step.isCompleted ? 'bg-yellow-400' : 'bg-[#111] border border-neutral-700'}`}>
                {step.isCompleted && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-black font-bold">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${step.isCompleted ? 'text-white font-bold' : 'text-neutral-500 font-medium'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Botón Track Order */}
        <div className="mt-10">
          <button
            onClick={handleTrackOrder}
            disabled={!isTrackEnabled}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg ${isTrackEnabled
                ? 'bg-yellow-400 text-black active:scale-95 hover:bg-yellow-500'
                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed opacity-50'
              }`}
          >
            Track Order
          </button>
        </div>

        {/* Panel Expandible (Acordeón Dinámico) */}
        <div className="mt-8">
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl cursor-pointer hover:bg-[#222] transition-colors border border-neutral-800"
          >
            <span className="text-sm font-bold text-neutral-300">
              {activeTab === 'pickup' ? 'Pickup Data' : 'Dropoff Data'}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className={`w-4 h-4 text-yellow-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="p-4 space-y-4 text-xs text-neutral-400 leading-relaxed bg-[#111111] rounded-lg border border-neutral-800">
              <p className="font-medium text-neutral-300">
                {activeTab === 'pickup'
                  ? detail.pickupLocation.address
                  : detail.dropoffLocation.address}
              </p>

              <div className="flex gap-3 text-neutral-500 items-center font-mono">
                <span>
                  {activeTab === 'pickup'
                    ? detail.pickupLocation.startDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
                    : detail.dropoffLocation.startDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-[8px]">●</span>
                <span>
                  {activeTab === 'pickup'
                    ? detail.pickupLocation.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : detail.dropoffLocation.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-800 space-y-1">
                <p className="text-white font-medium flex items-center gap-2">
                  <span className="text-neutral-500">📞</span> +52 {detail.managerPhone}
                </p>
                <p className="text-white font-medium flex items-center gap-2">
                  <span className="text-neutral-500">✉️</span> {detail.managerEmail}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}