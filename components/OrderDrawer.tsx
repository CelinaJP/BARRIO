import React, { useState, useMemo } from 'react';
import { Table, Product, ProductCategory, TableStatus, OrderItem, Zone, OrderStatus } from '../types';
import { MENU_ITEMS } from '../constants';
import { X, Plus, Trash2, Send, ChefHat, User, CreditCard, Receipt, Coffee, Check } from 'lucide-react';

interface OrderDrawerProps {
  table: Table;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTable: (updatedTable: Table) => void;
}

const OrderDrawer: React.FC<OrderDrawerProps> = ({ table, isOpen, onClose, onUpdateTable }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(ProductCategory.CAFE);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => 
    MENU_ITEMS.filter(item => item.category === selectedCategory),
  [selectedCategory]);

  if (!isOpen) return null;

  const handleAddProduct = (product: Product) => {
    const newOrder: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      product,
      quantity: 1,
      timestamp: Date.now(),
      status: OrderStatus.PENDING // Default status sent to kitchen
    };

    const updatedOrders = [...table.orders, newOrder];
    const newTotal = updatedOrders.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // If adding item to a free table, automatically set to occupied
    const newStatus = table.status === TableStatus.FREE ? TableStatus.OCCUPIED : table.status;
    const newPax = (table.peopleCount === 0 && table.status === TableStatus.FREE) ? 1 : table.peopleCount;

    onUpdateTable({
      ...table,
      status: newStatus,
      orders: updatedOrders,
      total: newTotal,
      peopleCount: newPax
    });
  };

  const handleRemoveOrder = (orderId: string) => {
    const updatedOrders = table.orders.filter(o => o.id !== orderId);
    const newTotal = updatedOrders.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    onUpdateTable({
      ...table,
      orders: updatedOrders,
      total: newTotal,
      status: updatedOrders.length === 0 ? TableStatus.FREE : table.status 
    });
  };

  const handleStatusChange = (status: TableStatus) => {
    onUpdateTable({
      ...table,
      status,
      // Reset data if setting to free
      ...(status === TableStatus.FREE ? { orders: [], total: 0, peopleCount: 0 } : {})
    });
    if (status === TableStatus.FREE) {
        onClose();
    }
  };

  const updatePax = (increment: number) => {
      const newCount = Math.max(0, table.peopleCount + increment);
      onUpdateTable({ ...table, peopleCount: newCount });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-barrio-cream h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="p-4 bg-barrio-blue text-white flex justify-between items-center shadow-md">
          <div>
            <span className="text-blue-200 text-xs uppercase tracking-wider">{table.zone}</span>
            <h2 className="text-2xl font-serif">{table.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Status & Controls */}
        <div className="p-4 border-b border-barrio-wood/10 bg-white">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {Object.values(TableStatus).map((status) => (
                    <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-colors whitespace-nowrap
                            ${table.status === status 
                                ? 'bg-barrio-blue text-white' 
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between bg-barrio-cream p-3 rounded-lg border border-barrio-wood/20">
                <div className="flex items-center gap-2 text-barrio-wood">
                    <User size={18} />
                    <span className="font-semibold">Personas</span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => updatePax(-1)} className="w-8 h-8 rounded-full bg-white border border-barrio-wood/30 flex items-center justify-center hover:bg-red-50 text-barrio-wood">-</button>
                    <span className="font-bold text-lg w-4 text-center">{table.peopleCount}</span>
                    <button onClick={() => updatePax(1)} className="w-8 h-8 rounded-full bg-barrio-blue text-white flex items-center justify-center hover:bg-blue-900">+</button>
                </div>
            </div>
        </div>

        {/* Main Content Area: Split into Menu and Current Order */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left/Top: Product Menu */}
            <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
                {/* Categories */}
                <div className="flex overflow-x-auto p-2 gap-2 bg-white border-b border-gray-200 no-scrollbar">
                    {Object.values(ProductCategory).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                                ${selectedCategory === cat 
                                    ? 'bg-barrio-blue text-white shadow-md transform scale-105' 
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product List */}
                <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-3 content-start">
                    {filteredProducts.map(product => (
                        <button
                            key={product.id}
                            onClick={() => handleAddProduct(product)}
                            className="bg-white p-3 rounded-lg border border-gray-200 hover:border-barrio-blue hover:shadow-md transition-all text-left flex flex-col justify-between group h-24"
                        >
                            <span className="font-medium text-gray-800 text-sm line-clamp-2">{product.name}</span>
                            <div className="flex justify-between items-end mt-2">
                                <span className="text-barrio-blue font-bold">${product.price}</span>
                                <div className="bg-blue-50 text-barrio-blue p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus size={14} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right/Bottom: Current Orders (Comanda) */}
            <div className="h-1/3 md:h-auto md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 bg-white flex flex-col shadow-inner">
                <div className="p-3 bg-barrio-cream/50 border-b border-gray-200 font-serif font-bold text-barrio-blue flex items-center gap-2">
                    <Receipt size={16} />
                    Comanda Actual
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {table.orders.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm italic">
                            <Coffee size={32} className="mb-2 opacity-50" />
                            <p>Sin productos cargados</p>
                        </div>
                    ) : (
                        table.orders.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100 animate-fade-in">
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-800">{item.product.name}</div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">${item.product.price}</span>
                                        {item.status === OrderStatus.READY ? (
                                             <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1 rounded">LISTO</span>
                                        ) : (
                                            <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1 rounded">COCINA</span>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleRemoveOrder(item.id)}
                                    className="text-red-400 hover:text-red-600 p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4 text-xl font-serif text-barrio-blue font-bold">
                        <span>Total</span>
                        <span>${table.total.toLocaleString('es-AR')}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            className="bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                            onClick={onClose}
                        >
                            <ChefHat size={18} />
                            Marchar
                        </button>
                         <button 
                            className="bg-barrio-blue hover:bg-blue-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                            onClick={() => handleStatusChange(TableStatus.WAITING_PAYMENT)}
                        >
                            <CreditCard size={18} />
                            Cobrar
                        </button>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDrawer;