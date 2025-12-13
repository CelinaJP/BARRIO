import React, { useState } from 'react';
import { INITIAL_TABLES } from './constants';
import { Table, Zone, TableStatus, UserRole, OrderStatus } from './types';
import TableCard from './components/TableCard';
import OrderDrawer from './components/OrderDrawer';
import LoginScreen from './components/LoginScreen';
import KitchenDisplay from './components/KitchenDisplay';
import AdminDashboard from './components/AdminDashboard';
import { LayoutGrid, UtensilsCrossed, Coffee, Home, LogOut, ChartBar, ChefHat } from 'lucide-react';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentView, setCurrentView] = useState<'FLOOR' | 'KITCHEN' | 'ADMIN'>('FLOOR');
  
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [activeZone, setActiveZone] = useState<Zone | 'ALL'>('ALL');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Update table data (used by Floor Plan and Kitchen)
  const handleUpdateTable = (updatedTable: Table) => {
    setTables(prev => prev.map(t => t.id === updatedTable.id ? updatedTable : t));
    setSelectedTable(prev => prev && prev.id === updatedTable.id ? updatedTable : prev);
  };

  // Specific handler for Kitchen to mark items as ready
  const handleKitchenStatusUpdate = (tableId: string, itemId: string, newStatus: OrderStatus) => {
    setTables(prev => prev.map(table => {
      if (table.id !== tableId) return table;
      return {
        ...table,
        orders: table.orders.map(order => 
          order.id === itemId ? { ...order, status: newStatus } : order
        )
      };
    }));
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    // Route to default view based on role
    if (role === 'KITCHEN') setCurrentView('KITCHEN');
    else if (role === 'ADMIN') setCurrentView('ADMIN');
    else setCurrentView('FLOOR');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView('FLOOR');
  };

  // Login Screen Render
  if (!userRole) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Kitchen specific view (No standard layout)
  if (currentView === 'KITCHEN') {
    return (
        <div className="relative">
             <button 
                onClick={handleLogout} 
                className="absolute top-4 right-4 z-50 text-slate-400 hover:text-white flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-xs"
             >
                <LogOut size={14} /> Salir
             </button>
            <KitchenDisplay tables={tables} onItemStatusChange={handleKitchenStatusUpdate} />
        </div>
    );
  }

  // --- Main Layout for Waiter/Admin ---

  const filteredTables = activeZone === 'ALL' 
    ? tables 
    : tables.filter(t => t.zone === activeZone);

  const occupiedCount = tables.filter(t => t.status === TableStatus.OCCUPIED).length;
  const freeCount = tables.filter(t => t.status === TableStatus.FREE).length;

  return (
    <div className="min-h-screen flex flex-col bg-barrio-cream text-barrio-blue font-sans selection:bg-barrio-blue selection:text-white">
      
      {/* Navbar Branding */}
      <header className="bg-barrio-blue text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full hidden sm:block">
                    <Coffee className="text-barrio-blue" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-serif tracking-wide">BARRIO</h1>
                    <p className="text-xs text-blue-200 tracking-[0.2em] uppercase hidden sm:block">Café & Bar</p>
                </div>
            </div>

            {/* View Switcher for Admin */}
            <div className="flex items-center gap-2 bg-blue-900/50 p-1 rounded-lg">
                {userRole === 'ADMIN' && (
                    <>
                        <button 
                            onClick={() => setCurrentView('FLOOR')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${currentView === 'FLOOR' ? 'bg-white text-barrio-blue shadow' : 'text-blue-200 hover:bg-white/10'}`}
                        >
                            <LayoutGrid size={16} /> <span className="hidden md:inline">Salón</span>
                        </button>
                        <button 
                            onClick={() => setCurrentView('ADMIN')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${currentView === 'ADMIN' ? 'bg-white text-barrio-blue shadow' : 'text-blue-200 hover:bg-white/10'}`}
                        >
                            <ChartBar size={16} /> <span className="hidden md:inline">Admin</span>
                        </button>
                    </>
                )}
                 <button 
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-md text-sm font-medium text-red-200 hover:bg-red-900/50 transition-colors flex items-center gap-2 ml-2"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col">
        
        {/* Render View: Admin Dashboard */}
        {currentView === 'ADMIN' && (
            <AdminDashboard tables={tables} />
        )}

        {/* Render View: Floor Plan */}
        {currentView === 'FLOOR' && (
            <div className="p-4 md:p-6 flex flex-col gap-6">
                {/* Zone Filters */}
                <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 no-scrollbar">
                    <button 
                        onClick={() => setActiveZone('ALL')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all font-bold whitespace-nowrap
                        ${activeZone === 'ALL' 
                            ? 'bg-barrio-blue text-white border-barrio-blue shadow-lg' 
                            : 'bg-white text-barrio-blue border-transparent hover:border-barrio-blue/20'}`}
                    >
                        <LayoutGrid size={18} />
                        <span>Todo el mapa</span>
                    </button>
                    {Object.values(Zone).map(zone => (
                        <button 
                            key={zone}
                            onClick={() => setActiveZone(zone)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all font-bold whitespace-nowrap
                            ${activeZone === zone 
                                ? 'bg-barrio-blue text-white border-barrio-blue shadow-lg' 
                                : 'bg-white text-barrio-blue border-transparent hover:border-barrio-blue/20'}`}
                        >
                            {zone === Zone.SALON && <Home size={18} />}
                            {zone === Zone.VEREDA && <Coffee size={18} />}
                            {zone === Zone.BARRA && <UtensilsCrossed size={18} />}
                            <span>{zone}</span>
                        </button>
                    ))}
                </div>

                {/* Visual Floor Plan Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 animate-fade-in-up">
                    {filteredTables.map(table => (
                        <TableCard 
                            key={table.id} 
                            table={table} 
                            onClick={setSelectedTable} 
                        />
                    ))}
                    
                    {/* Empty state if no tables in zone */}
                    {filteredTables.length === 0 && (
                        <div className="col-span-full h-64 flex flex-col items-center justify-center text-barrio-blue/40 border-2 border-dashed border-barrio-blue/20 rounded-xl">
                            <LayoutGrid size={48} className="mb-4 opacity-50"/>
                            <p className="text-lg font-medium">No hay mesas en esta zona</p>
                        </div>
                    )}
                </div>
            </div>
        )}

      </main>

      {/* Order Drawer (Modal) - Only on Floor View */}
      {selectedTable && currentView === 'FLOOR' && (
          <OrderDrawer 
            table={selectedTable}
            isOpen={!!selectedTable}
            onClose={() => setSelectedTable(null)}
            onUpdateTable={handleUpdateTable}
          />
      )}

      {/* Mobile Sticky Stats Bar (Only Floor View) */}
      {currentView === 'FLOOR' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-around text-xs font-bold text-barrio-blue shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
            <div className="flex flex-col items-center">
                <span className="text-xl">{freeCount}</span>
                <span className="text-gray-400">LIBRES</span>
            </div>
            <div className="w-px bg-gray-200 h-full"></div>
            <div className="flex flex-col items-center">
                <span className="text-xl">{occupiedCount}</span>
                <span className="text-gray-400">OCUPADAS</span>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;