import React from 'react';
import { Table, TableStatus } from '../types';
import { Coffee, Users, DollarSign, Clock } from 'lucide-react';

interface TableCardProps {
  table: Table;
  onClick: (table: Table) => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onClick }) => {
  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.FREE:
        return 'bg-white border-barrio-blue/20 text-barrio-blue hover:border-barrio-blue';
      case TableStatus.OCCUPIED:
        return 'bg-barrio-blue/10 border-barrio-blue text-barrio-blue shadow-md';
      case TableStatus.WAITING_PAYMENT:
        return 'bg-yellow-50 border-yellow-500 text-yellow-800 ring-1 ring-yellow-500';
      case TableStatus.RESERVED:
        return 'bg-gray-100 border-gray-300 text-gray-500 opacity-80';
      default:
        return 'bg-white';
    }
  };

  const getStatusLabel = (status: TableStatus) => {
      switch(status) {
          case TableStatus.FREE: return 'Libre';
          case TableStatus.OCCUPIED: return 'Ocupada';
          case TableStatus.WAITING_PAYMENT: return 'Cobrar';
          case TableStatus.RESERVED: return 'Reserva';
      }
  };

  return (
    <div 
      onClick={() => onClick(table)}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between h-32
        ${getStatusColor(table.status)}
      `}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg font-serif">{table.name}</h3>
        <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider
            ${table.status === TableStatus.FREE ? 'bg-green-100 text-green-800' : ''}
            ${table.status === TableStatus.OCCUPIED ? 'bg-blue-100 text-blue-800' : ''}
            ${table.status === TableStatus.WAITING_PAYMENT ? 'bg-yellow-100 text-yellow-800' : ''}
        `}>
          {getStatusLabel(table.status)}
        </span>
      </div>

      <div className="flex items-end justify-between mt-2">
        <div className="flex flex-col gap-1 text-sm opacity-80">
            {table.status !== TableStatus.FREE && (
                <>
                <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{table.peopleCount} pax</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{table.orders.length} items</span>
                </div>
                </>
            )}
             {table.status === TableStatus.FREE && (
                <div className="flex items-center gap-1 text-gray-400">
                    <Coffee size={14} />
                    <span>Disponible</span>
                </div>
             )}
        </div>
        
        {table.total > 0 && (
           <div className="flex items-center gap-0.5 font-bold text-lg">
             <span className="text-xs">$</span>
             {table.total.toLocaleString('es-AR')}
           </div>
        )}
      </div>
    </div>
  );
};

export default TableCard;