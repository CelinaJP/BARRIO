import React, { useState } from 'react';
import { Coffee, UserCircle2 } from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    
    // Simple mock authentication
    if (pin === '1234') {
      onLogin('ADMIN');
    } else if (pin === '0000') {
      onLogin('WAITER');
    } else if (pin === '1111') {
      onLogin('KITCHEN');
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-barrio-cream flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-barrio-blue/10">
        
        {/* Header Branding */}
        <div className="bg-barrio-blue p-8 flex flex-col items-center text-white">
          <div className="bg-white p-3 rounded-full mb-4 shadow-lg">
             <Coffee className="text-barrio-blue" size={32} />
          </div>
          <h1 className="text-4xl font-serif tracking-wide mb-1">BARRIO</h1>
          <p className="text-xs text-blue-200 tracking-[0.3em] uppercase">Café & Bar</p>
        </div>

        {/* Login Form */}
        <div className="p-8">
            <h2 className="text-center text-xl font-bold text-barrio-blue mb-6">Iniciar Sesión</h2>
            
            <form onSubmit={handlePinSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2 text-center">Ingrese su PIN</label>
                    <input 
                        type="password" 
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full text-center text-4xl tracking-[1em] font-serif py-4 border-b-2 border-barrio-blue/20 focus:border-barrio-blue focus:outline-none transition-colors bg-transparent text-barrio-wood"
                        placeholder="••••"
                        autoFocus
                    />
                </div>

                {error && (
                    <p className="text-red-600 text-center text-sm font-bold animate-bounce">
                        PIN Incorrecto
                    </p>
                )}

                <button 
                    type="submit"
                    className="w-full bg-barrio-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    Entrar
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-center text-gray-400 mb-2">Pines de prueba:</p>
                <div className="flex justify-center gap-4 text-xs font-mono text-barrio-wood/70">
                    <span>Mozo: 0000</span>
                    <span>Cocina: 1111</span>
                    <span>Admin: 1234</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;