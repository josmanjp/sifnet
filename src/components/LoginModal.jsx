// src/components/Login.jsx
import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, CheckCircle, ShieldAlert, X } from 'lucide-react';
import logo from '../assets/logo.png';


export default function LoginModal({ isOpen, onClose }) {
  const { login } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Calcular fortaleza de contraseña
  useEffect(() => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    if (password.length >= 12) strength += 1;
    
    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (password.length === 0) return '';
    if (passwordStrength <= 2) return 'Débil';
    if (passwordStrength === 3) return 'Moderada';
    if (passwordStrength === 4) return 'Fuerte';
    return 'Muy fuerte';
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Reset form when modal closes
  const handleClose = () => {
    setEmail('');
    setPassword('');
    setNombre('');
    setTelefono('');
    setConfirmPassword('');
    setPasswordError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setActiveTab('login');
    onClose();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("❌ Por favor complete todos los campos");
      return;
    }
    
    setLoading(true);
    
    try {
        console.log("API_URL:", API_URL); // Debugging line
      if (!API_URL) {
        toast.error("❌ Error de configuración");
        return;
      }

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
    
      if (data.success) {
        login(data.usuario, data.token);
        toast.success("✅ Ingreso exitoso");
        handleClose();
      } else {
        toast.error(data.message || "❌ Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error en login:", err);
      if (err.name === 'TypeError') {
        toast.error("❌ Error de conexión. Verifique su red.");
      } else {
        toast.error("❌ Error en el servidor. Inténtelo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    if (!email || !nombre || !telefono || !password || !confirmPassword) {
      toast.error("❌ Por favor complete todos los campos");
      return;
    }
    
    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (passwordStrength < 3) {
      setPasswordError("La contraseña es demasiado débil");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    
    try {
      if (!API_URL) {
        toast.error("❌ Error de configuración");
        return;
      }

      const res = await fetch(`${API_URL}/auth/registeruser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          nombre, 
          telefono, 
          password
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
    
      if (data.success) {
        toast.success("✅ Registro exitoso. Por favor inicia sesión");
        setActiveTab('login');
        // Clear form
        setEmail('');
        setNombre('');
        setTelefono('');
        setPassword('');
        setConfirmPassword('');
        setPasswordError('');
      } else {
        toast.error(data.message || "❌ Error en registro");
      }
    } catch (err) {
      console.error("Error en registro:", err);
      if (err.name === 'TypeError') {
        toast.error("❌ Error de conexión. Verifique su red.");
      } else {
        toast.error("❌ Error en el servidor. Inténtelo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-200 animate-in fade-in zoom-in-95 my-2 mx-auto flex flex-col"
           style={{ maxHeight: 'calc(100vh - 2rem)', minHeight: '400px' }}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
        >
          <X size={24} />
        </button>
        
        {/* Header fijo */}
        <div className="flex-shrink-0 p-6 pt-12 pb-4">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="h-20 w-20 object-contain animate-fadeIn transition-transform duration-300 hover:scale-110" />
          </div>
          <div className="flex justify-center mb-4">
            <h2 className="text-xl font-bold text-center" style={{ color: '#2f4870' }}>SIFnet</h2>
          </div>

          {/* Pestañas */}
          <div className="flex mb-4 border-b">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'login' ? 'border-b-2 text-gray-500' : 'text-gray-500'}`}
              style={activeTab === 'login' ? { color: '#2f4870', borderBottomColor: '#2f4870' } : {}}
              onClick={() => {
                setActiveTab('login');
                setPasswordError('');
              }}
            >
              Iniciar Sesión
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'register' ? 'border-b-2 text-gray-500' : 'text-gray-500'}`}
              style={activeTab === 'register' ? { color: '#2f4870', borderBottomColor: '#2f4870' } : {}}
              onClick={() => {
                setActiveTab('register');
                setPasswordError('');
              }}
            >
              Registrarse
            </button>
          </div>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">

        {/* Formulario de Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full p-3 border rounded-lg text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="w-full p-3 border rounded-lg pr-10 text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-black"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button 
              type="submit" 
              className="w-full text-white py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium mt-4"
              style={{ backgroundColor: '#2f4870' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#243a5e'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2f4870'}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cargando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        )}

        {/* Formulario de Registro */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <input
              type="email"
              placeholder="Correo electrónico*"
              className="w-full p-2 border rounded-lg text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Nombre completo*"
              className="w-full p-2 border rounded-lg text-sm"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />

            <input
              type="tel"
              placeholder="541123456789*"
              className="w-full p-2 border rounded-lg text-sm"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña*"
                className="w-full p-2 border rounded-lg pr-10 text-sm"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500 hover:text-black"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar contraseña*"
                className="w-full p-2 border rounded-lg pr-10 text-sm"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError('');
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2 text-gray-500 hover:text-black"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Indicador de fortaleza de contraseña */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">
                  Fortaleza: {getPasswordStrengthText()}
                </span>
                {passwordStrength >= 3 && (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                )}
                {passwordStrength > 0 && passwordStrength < 3 && (
                  <ShieldAlert className="w-3 h-3 text-yellow-500" />
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`${getPasswordStrengthColor()} h-1.5 rounded-full`} 
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            {passwordError && (
              <div className="mb-2 text-red-500 text-xs">
                {passwordError}
              </div>
            )}

            <div className="text-xs text-gray-500 mb-3">
              <p className="mb-1">La contraseña debe tener:</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <span>• Min 8 caracteres</span>
                <span>• Una mayúscula</span>
                <span>• Un número</span>
                <span>• Un símbolo</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full text-white py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium mt-3"
              style={{ backgroundColor: '#2f4870' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#243a5e'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2f4870'}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registrando...
                </div>
              ) : (
                'Registrarse'
              )}
            </button>
          </form>
        )}
        </div>
      </div>
    </div>,
    document.body
  );
}