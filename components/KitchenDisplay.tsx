import React from 'react';
import { Table, OrderStatus, TableStatus } from '../types';
import { ChefHat, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface KitchenDisplayProps {
  tables: Table[];
  onItemStatusChange: (tableId: string, orderItemId: string, newStatus: OrderStatus) => void;
}

const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ tables, onItemStatusChange }) => {
  // Filter only tables that have pending orders
  const activeTables = tables.filter(table => 
    table.status !== TableStatus.FREE && 
    table.orders.some(o => o.status === OrderStatus.PENDING)
  ).sort((a, b) => {
    // Sort by oldest pending order
    const aTime = Math.min(...a.orders.filter(o => o.status === OrderStatus.PENDING).map(o => o.timestamp));
    const bTime = Math.min(...b.orders.filter(o => o.status === OrderStatus.PENDING).map(o => o.timestamp));
    return aTime - bTime;
  });

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  const getWaitTime = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 60000);
    return diff;
  };

  return (
    <div className="p-4 md:p-6 h-full bg-slate-900 min-h-screen text-slate-100">
        <header className="mb-6 flex justify-between items-center border-b border-slate-700 pb-4">
            <h2 className="text-3xl font-serif flex items-center gap-3 text-white">
                <ChefHat className="text-orange-500" size={32} />
                Cocina / Comandas
            </h2>
            <div className="text-slate-400 font-mono text-sm">
                Pendientes: {activeTables.length} mesas
            </div>
        </header>

        {activeTables.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-slate-500 opacity-50">
                <CheckCircle2 size={64} className="mb-4" />
                <p className="text-2xl font-serif">Todo marchado</p>
                <p>No hay pedidos pendientes en este momento.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {activeTables.map(table => {
                    const pendingOrders = table.orders.filter(o => o.status === OrderStatus.PENDING);
                    const oldestOrderTime = Math.min(...pendingOrders.map(o => o.timestamp));
                    const waitTime = getWaitTime(oldestOrderTime);
                    const isLate = waitTime > 15;

                    return (
                        <div key={table.id} className={`bg-slate-800 rounded-lg overflow-hidden border-t-4 shadow-xl flex flex-col ${isLate ? 'border-red-500' : 'border-blue-500'}`}>
                            {/* Card Header */}
                            <div className="p-3 bg-slate-700/50 flex justify-between items-center">
                                <h3 className="font-bold text-lg">{table.name}</h3>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${isLate ? 'bg-red-900/50 text-red-300' : 'bg-slate-600 text-slate-300'}`}>
                                    <Clock size={12} />
                                    <span>{waitTime} min</span>
                                </div>
                            </div>

                            {/* Order List */}
                            <div className="p-3 flex-1 space-y-2">
                                {table.orders.map((order, idx) => (
                                    order.status === OrderStatus.PENDING && (
                                        <div key={order.id} className="flex justify-between items-start group p-2 bg-slate-700/30 rounded border border-transparent hover:border-slate-600 transition-all">
                                            <div className="flex gap-3">
                                                <span className="font-bold text-orange-400 text-lg w-6">{order.quantity}</span>
                                                <div>
                                                    <span className="text-slate-200 font-medium block">{order.product.name}</span>
                                                    <span className="text-xs text-slate-500">{formatTime(order.timestamp)}</span>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => onItemStatusChange(table.id, order.id, OrderStatus.READY)}
                                                className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-full transition-colors"
                                                title="Marcar como listo"
                                            >
                                                <CheckCircle2 size={20} />
                                            </button>
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-2 bg-slate-900/50 border-t border-slate-700 text-center">
                                <span className="text-xs text-slate-500 uppercase tracking-widest">{table.zone}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
  );
};

export default KitchenDisplay;