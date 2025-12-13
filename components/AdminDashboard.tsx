import React from 'react';
import { Table, TableStatus } from '../types';
import { MENU_ITEMS } from '../constants';
import { TrendingUp, Package, DollarSign, Archive } from 'lucide-react';

interface AdminDashboardProps {
  tables: Table[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ tables }) => {
  // Calculate real-time sales from current session (Occupied + Waiting Payment)
  const currentSales = tables.reduce((acc, table) => {
    // We only count table totals that are occupied or waiting for payment
    // In a real app, this would query a database of "Closed" orders too
    if (table.status !== TableStatus.FREE && table.status !== TableStatus.RESERVED) {
        return acc + table.total;
    }
    return acc;
  }, 0);

  // Simulated Historical Data (since we don't have a backend DB)
  const historicalSales = 154300; 
  const totalDailySales = currentSales + historicalSales;

  return (
    <div className="p-4 md:p-6 animate-fade-in space-y-6">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-barrio-blue/10 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Caja Actual (En mesas)</p>
                    <h3 className="text-3xl font-serif text-barrio-blue mt-1">${currentSales.toLocaleString('es-AR')}</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-full text-barrio-blue">
                    <TrendingUp size={24} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-barrio-blue/10 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Día (Est.)</p>
                    <h3 className="text-3xl font-serif text-barrio-wood mt-1">${totalDailySales.toLocaleString('es-AR')}</h3>
                </div>
                <div className="bg-orange-50 p-3 rounded-full text-barrio-wood">
                    <DollarSign size={24} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-barrio-blue/10 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Items en Carta</p>
                    <h3 className="text-3xl font-serif text-green-800 mt-1">{MENU_ITEMS.length}</h3>
                </div>
                <div className="bg-green-50 p-3 rounded-full text-green-800">
                    <Archive size={24} />
                </div>
            </div>
        </div>

        {/* Stock Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-serif text-xl text-barrio-blue flex items-center gap-2">
                    <Package size={20} />
                    Control de Stock
                </h3>
                <span className="text-xs text-gray-500 italic">Stock simulado</span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="p-4">Producto</th>
                            <th className="p-4">Categoría</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Stock Est.</th>
                            <th className="p-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {MENU_ITEMS.map((item, idx) => {
                            // Generate a consistent random-ish stock number based on name length for demo
                            const mockStock = (item.name.length * 7) % 50; 
                            const isLowStock = mockStock < 10;

                            return (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-800">{item.name}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 border border-gray-200">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">${item.price}</td>
                                    <td className="p-4 font-mono font-bold">{mockStock} u.</td>
                                    <td className="p-4">
                                        {isLowStock ? (
                                            <span className="inline-flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-full">
                                                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                                                BAJO
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                                                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                                                OK
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;