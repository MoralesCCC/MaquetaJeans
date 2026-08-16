import React, { useState } from 'react';
import {
  Package,
  ShoppingCart,
  LogOut,
  Search,
  Boxes,
  Warehouse,
  BarChart3,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Trash2,
  X,
  CheckCircle2,
  ShoppingBag,
  CreditCard,
  DollarSign,
  TrendingUp,
  Receipt,
  Edit3,
  Check,
  EyeIcon,
  Plus,
  Minus
} from 'lucide-react';

// ----------------------------------------------------
// BASE DE DATOS DE USUARIOS
// ----------------------------------------------------
const USERS_DATABASE = [
  { username: 'admin', password: 'admin123', name: 'Carlos Morales', role: 'admin', label: 'Administrador' },
  { username: 'bodega', password: 'bodega123', name: 'Ramiro Bodega', role: 'bodega', label: 'Jefe de Bodega' },
  { username: 'ventas', password: 'ventas123', name: 'Laura Ventas', role: 'ventas', label: 'Asesor Comercial' }
];

// ----------------------------------------------------
// DATOS INICIALES DE JEANES
// ----------------------------------------------------
const initialJeansData = [
  {
    id: 'J-001',
    nombre: 'Jean Wide Leg High Rise',
    categoria: 'Damas',
    imagen: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
    precio: 85000,
    variantes: [
      { colorNombre: 'Azul Clásico', hex: '#2563eb', tallas: { '6': 10, '8': 15, '10': 20, '12': 12, '14': 5 } },
      { colorNombre: 'Tono Hielo', hex: '#93c5fd', tallas: { '6': 2, '8': 5, '10': 8, '12': 0, '14': 1 } }
    ]
  },
  {
    id: 'J-002',
    nombre: 'Jean Mom Fit Vintage',
    categoria: 'Damas',
    imagen: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=600',
    precio: 79000,
    variantes: [
      { colorNombre: 'Negro Lavado', hex: '#1e293b', tallas: { '6': 8, '8': 12, '10': 18, '12': 10, '14': 0 } },
      { colorNombre: 'Azul Medio', hex: '#3b82f6', tallas: { '6': 14, '8': 20, '10': 15, '12': 6, '14': 4 } }
    ]
  },
  {
    id: 'J-003',
    nombre: 'Jean Skinny Push Up',
    categoria: 'Damas',
    imagen: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
    precio: 75000,
    variantes: [
      { colorNombre: 'Azul Oscuro', hex: '#1e3a8a', tallas: { '6': 15, '8': 25, '10': 30, '12': 20, '14': 10 } },
      { colorNombre: 'Blanco Marfil', hex: '#f8fafc', tallas: { '6': 0, '8': 3, '10': 5, '12': 1, '14': 0 } }
    ]
  },
  {
    id: 'J-004',
    nombre: 'Jean Cargo Streetwear',
    categoria: 'Unisex',
    imagen: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
    precio: 92000,
    variantes: [
      { colorNombre: 'Verde Kaki', hex: '#4d7c0f', tallas: { '6': 4, '8': 10, '10': 15, '12': 8, '14': 2 } },
      { colorNombre: 'Gris Ácido', hex: '#64748b', tallas: { '6': 6, '8': 12, '10': 10, '12': 4, '14': 0 } }
    ]
  },
  {
    id: 'J-005',
    nombre: 'Jean Straight Classic',
    categoria: 'Caballeros',
    imagen: 'https://images.unsplash.com/photo-1542272604-780c36856842?auto=format&fit=crop&q=80&w=600',
    precio: 82000,
    variantes: [
      { colorNombre: 'Azul Suave', hex: '#60a5fa', tallas: { '6': 12, '8': 18, '10': 22, '12': 15, '14': 6 } },
      { colorNombre: 'Azul Intenso', hex: '#1d4ed8', tallas: { '6': 8, '8': 10, '10': 14, '12': 9, '14': 3 } }
    ]
  }
];

// ----------------------------------------------------
// HISTORIAL DE VENTAS INICIAL DE HOY
// ----------------------------------------------------
const initialSalesToday = [
  {
    id: 'VEN-101',
    hora: '10:30 AM',
    vendedor: 'Laura Ventas',
    total: 164000,
    itemsCount: 2,
    prendas: ['Jean Wide Leg (Azul Clásico - T8)', 'Jean Mom Fit (Negro Lavado - T10)']
  },
  {
    id: 'VEN-102',
    hora: '02:15 PM',
    vendedor: 'Laura Ventas',
    total: 92000,
    itemsCount: 1,
    prendas: ['Jean Cargo Streetwear (Verde Kaki - T10)']
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('ventas');
  const [jeansList, setJeansList] = useState(initialJeansData);
  const [salesHistory, setSalesHistory] = useState(initialSalesToday);
  const [searchTerm, setSearchTerm] = useState('');

  // ESTADO CARRITO DE VENTAS
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [saleNotification, setSaleNotification] = useState('');

  // ESTADOS LOGIN
  const [inputUser, setInputUser] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  // CAMBIAR PRECIO DESDE EL PANEL ADMIN
  const handleUpdatePrice = (jeanId, newPrice) => {
    const numericPrice = Math.max(0, parseInt(newPrice) || 0);
    setJeansList(prev => prev.map(j => j.id === jeanId ? { ...j, precio: numericPrice } : j));
  };

  // LÓGICA DEL CARRITO (SOLO PARA VENTAS)
  const addToCart = (jean, colorNombre, hex, talla, qtyToAdd = 1) => {
    const variante = jean.variantes.find(v => v.colorNombre === colorNombre);
    const stockDisponible = variante?.tallas[talla] || 0;

    const existingIndex = cart.findIndex(
      item => item.jeanId === jean.id && item.colorNombre === colorNombre && item.talla === talla
    );

    const cantidadActual = existingIndex >= 0 ? cart[existingIndex].cantidad : 0;

    if (cantidadActual + qtyToAdd > stockDisponible) {
      alert(`No hay suficiente stock disponible. Unidades en bodega: ${stockDisponible}`);
      return;
    }

    if (existingIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].cantidad += qtyToAdd;
      setCart(updatedCart);
    } else {
      setCart([...cart, {
        jeanId: jean.id,
        jeanNombre: jean.nombre,
        imagen: jean.imagen,
        colorNombre,
        hex,
        talla,
        precio: jean.precio,
        cantidad: qtyToAdd
      }]);
    }
  };

  const updateCartItemQty = (index, delta) => {
    const item = cart[index];
    const jean = jeansList.find(j => j.id === item.jeanId);
    const variante = jean?.variantes.find(v => v.colorNombre === item.colorNombre);
    const stockMax = variante?.tallas[item.talla] || 0;

    const newQty = item.cantidad + delta;
    if (newQty > stockMax) {
      alert(`Límite de stock alcanzado (${stockMax} Und disp.)`);
      return;
    }

    if (newQty <= 0) {
      removeFromCart(index);
    } else {
      const updatedCart = [...cart];
      updatedCart[index].cantidad = newQty;
      setCart(updatedCart);
    }
  };

  const handleSetCartItemQty = (index, value) => {
    if (value === '') {
      const updatedCart = [...cart];
      updatedCart[index].cantidad = '';
      setCart(updatedCart);
      return;
    }

    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) return;

    const item = cart[index];
    const jean = jeansList.find(j => j.id === item.jeanId);
    const variante = jean?.variantes.find(v => v.colorNombre === item.colorNombre);
    const stockMax = variante?.tallas[item.talla] || 0;

    if (numericValue > stockMax) {
      alert(`Límite de stock alcanzado (${stockMax} Und disp.)`);
      const updatedCart = [...cart];
      updatedCart[index].cantidad = stockMax;
      setCart(updatedCart);
      return;
    }

    if (numericValue <= 0) {
      removeFromCart(index);
    } else {
      const updatedCart = [...cart];
      updatedCart[index].cantidad = numericValue;
      setCart(updatedCart);
    }
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // CHECKOUT
  const handleCheckout = () => {
    if (cart.length === 0) return;

    setJeansList(prevList => {
      let updatedList = [...prevList];
      cart.forEach(cartItem => {
        updatedList = updatedList.map(jean => {
          if (jean.id !== cartItem.jeanId) return jean;
          return {
            ...jean,
            variantes: jean.variantes.map(v => {
              if (v.colorNombre !== cartItem.colorNombre) return v;
              return {
                ...v,
                tallas: {
                  ...v.tallas,
                  [cartItem.talla]: Math.max(0, (v.tallas[cartItem.talla] || 0) - (Number(cartItem.cantidad) || 0))
                }
              };
            })
          };
        });
      });
      return updatedList;
    });

    const totalCobrado = cart.reduce((acc, item) => acc + (item.precio * (Number(item.cantidad) || 0)), 0);
    const totalPrendas = cart.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0);

    const newSaleRecord = {
      id: `VEN-${100 + salesHistory.length + 1}`,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vendedor: currentUser.name,
      total: totalCobrado,
      itemsCount: totalPrendas,
      prendas: cart.map(i => `${i.jeanNombre} (${i.colorNombre} - T${i.talla}) x${i.cantidad}`)
    };

    setSalesHistory([newSaleRecord, ...salesHistory]);
    setCart([]);
    setIsCartOpen(false);

    setSaleNotification(`¡Venta realizada! Total: $${totalCobrado.toLocaleString()} COP. Registrada en el Dashboard de hoy.`);
    setTimeout(() => setSaleNotification(''), 5000);
  };

  // MODIFICAR CANTIDAD DE BODEGA ESCRIBIENDO EL NÚMERO DIRECTAMENTE
  const setStockDirectly = (jeanId, colorNombre, talla, value) => {
    const numericValue = Math.max(0, parseInt(value) || 0);
    setJeansList(prev =>
      prev.map(jean => {
        if (jean.id !== jeanId) return jean;
        return {
          ...jean,
          variantes: jean.variantes.map(varItem => {
            if (varItem.colorNombre !== colorNombre) return varItem;
            return {
              ...varItem,
              tallas: { ...varItem.tallas, [talla]: numericValue }
            };
          })
        };
      })
    );
  };

  const handleFormLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const foundUser = USERS_DATABASE.find(
      u => u.username.toLowerCase() === inputUser.trim().toLowerCase() && u.password === inputPass
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      if (foundUser.role === 'ventas') setActiveTab('ventas');
      else if (foundUser.role === 'bodega') setActiveTab('bodega');
      else setActiveTab('admin');
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  const fillCredentials = (u, p) => {
    setInputUser(u);
    setInputPass(p);
    setLoginError('');
  };

  const totalItemsEnCarrito = cart.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0);

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 mb-3">
              <Boxes size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Jeans System</h1>
            <p className="text-xs text-slate-500 mt-1">Plataforma de Control e Inventario</p>
          </div>

          <form onSubmit={handleFormLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center font-semibold">
                {loginError}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Usuario</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  required
                  placeholder="ej. admin, bodega, ventas"
                  value={inputUser}
                  onChange={(e) => setInputUser(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Contraseña</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={inputPass}
                  onChange={(e) => setInputPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-indigo-600/20"
            >
              Ingresar al Sistema
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              Acceso Rápido para Demostración
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <button
                type="button"
                onClick={() => fillCredentials('admin', 'admin123')}
                className="p-2 bg-purple-50 border border-purple-200 hover:bg-purple-100 rounded-xl text-[11px] text-purple-700 transition"
              >
                <div className="font-bold">Admin</div>
                <div className="text-[9px] opacity-70">admin123</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('bodega', 'bodega123')}
                className="p-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-[11px] text-emerald-700 transition"
              >
                <div className="font-bold">Bodega</div>
                <div className="text-[9px] opacity-70">bodega123</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('ventas', 'ventas123')}
                className="p-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl text-[11px] text-indigo-700 transition"
              >
                <div className="font-bold">Ventas</div>
                <div className="text-[9px] opacity-70">ventas123</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // INTERFAZ PRINCIPAL
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans relative">

      {/* HEADER CON PESTAÑAS SEGÚN ROL */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
              <Boxes size={22} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base leading-tight">Jeans</h2>
              <p className="text-[11px] text-slate-500 font-medium">Control e Inventario</p>
            </div>
          </div>

          <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(currentUser.role === 'admin' || currentUser.role === 'ventas') && (
              <button
                onClick={() => setActiveTab('ventas')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'ventas' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <ShoppingCart size={14} /> Catálogo
              </button>
            )}

            {(currentUser.role === 'admin' || currentUser.role === 'bodega') && (
              <button
                onClick={() => setActiveTab('bodega')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'bodega' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Warehouse size={14} /> Bodega
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'admin' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <BarChart3 size={14} /> Panel Admin
              </button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {currentUser.role === 'ventas' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl font-bold text-xs transition"
              >
                <ShoppingBag size={18} />
                <span className="hidden sm:inline">Carrito</span>
                {totalItemsEnCarrito > 0 && (
                  <span className="bg-indigo-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItemsEnCarrito}
                  </span>
                )}
              </button>
            )}

            <div className="text-right border-l border-slate-200 pl-3">
              <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
              <span className="text-[10px] text-slate-500 font-medium">{currentUser.label}</span>
            </div>

            <button
              onClick={() => { setCurrentUser(null); setInputUser(''); setInputPass(''); }}
              className="p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-xl border border-slate-200 transition"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* NOTIFICACIÓN DE VENTA */}
      {saleNotification && (
        <div className="bg-emerald-600 text-white p-3 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md">
          <CheckCircle2 size={18} />
          <span>{saleNotification}</span>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">

        {/* ---------------------------------------------------- */}
        {/* PESTAÑA 1: CATÁLOGO DE VENTAS                        */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'ventas' && (currentUser.role === 'ventas' || currentUser.role === 'admin') && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900">Catálogo Comercial de Productos</h3>
                <p className="text-xs text-slate-500">
                  {currentUser.role === 'admin'
                    ? 'Supervisión de catálogo comercial (Modo Inspección Administrador)'
                    : 'Seleccione el color, talla y agregue al carrito para realizar ventas'}
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar jean..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jeansList
                .filter(j => j.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || j.id.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((jean) => (
                  <JeanCatalogCard
                    key={jean.id}
                    jean={jean}
                    userRole={currentUser.role}
                    onAddToCart={addToCart}
                  />
                ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PESTAÑA 2: CONTROL DE BODEGA (MODIFICACIÓN DIRECTA)  */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'bodega' && (currentUser.role === 'bodega' || currentUser.role === 'admin') && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">Control de Unidades en Bodega</h3>
              <p className="text-xs text-slate-500">
                Escriba directamente la cantidad de unidades en cada talla para modificar el inventario de manera rápida y manual (Sin visualización de precios).
              </p>
            </div>

            <div className="space-y-4">
              {jeansList.map((jean) => (
                <div key={jean.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <img src={jean.imagen} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{jean.id}</span>
                        <h4 className="font-bold text-slate-900 text-sm">{jean.nombre}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Categoría: {jean.categoria}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jean.variantes.map((variante, idx) => (
                      <BodegaColorRow
                        key={idx}
                        jeanId={jean.id}
                        variante={variante}
                        onSetStockDirectly={setStockDirectly}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PESTAÑA 3: DASHBOARD ADMIN & AJUSTE DE PRECIOS        */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'admin' && currentUser.role === 'admin' && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500">Ventas Totales de Hoy</span>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <DollarSign size={18} />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900">
                  ${salesHistory.reduce((acc, s) => acc + s.total, 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">COP</span>
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Ingresos de hoy en caja</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500">Transacciones Hoy</span>
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Receipt size={18} />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900">{salesHistory.length}</p>
                <p className="text-[11px] text-indigo-600 font-semibold mt-1">Ventas facturadas</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500">Prendas Vendidas Hoy</span>
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                    <TrendingUp size={18} />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900">
                  {salesHistory.reduce((acc, s) => acc + s.itemsCount, 0)} Und
                </p>
                <p className="text-[11px] text-purple-600 font-semibold mt-1">Unidades despachadas</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Receipt className="text-purple-600" size={20} />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Ventas Realizadas Hoy (Dashboard de Control)</h4>
                  <p className="text-xs text-slate-500">Registro de facturas emitidas hoy por el módulo comercial</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Ticket ID</th>
                      <th className="py-3 px-4">Hora</th>
                      <th className="py-3 px-4">Vendedor</th>
                      <th className="py-3 px-4">Prendas Vendidas</th>
                      <th className="py-3 px-4 text-right">Total Cobrado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {salesHistory.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-purple-700">{sale.id}</td>
                        <td className="py-3 px-4 text-slate-500">{sale.hora}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{sale.vendedor}</td>
                        <td className="py-3 px-4">
                          <ul className="list-disc list-inside text-[11px] text-slate-600">
                            {sale.prendas.map((p, idx) => (
                              <li key={idx}>{p}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-emerald-600 text-sm">
                          ${sale.total.toLocaleString()} COP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Edit3 className="text-indigo-600" size={20} />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Ajuste Directo de Precios Comerciales</h4>
                  <p className="text-xs text-slate-500">Modifique el precio comercial COP de cada referencia para actualizar el catálogo de ventas.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jeansList.map((jean) => (
                  <AdminPriceCard
                    key={jean.id}
                    jean={jean}
                    onUpdatePrice={handleUpdatePrice}
                  />
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* DRAWER DEL CARRITO */}
      {isCartOpen && currentUser.role === 'ventas' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl relative">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-indigo-600" />
                  <h3 className="font-extrabold text-slate-900 text-lg">Carrito de Ventas</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShoppingBag size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-xs font-semibold">El carrito está vacío</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <img src={item.imagen} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />

                      <div className="flex-1">
                        <h5 className="font-bold text-slate-900 text-xs">{item.jeanNombre}</h5>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: item.hex }} />
                            {item.colorNombre}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-slate-700">Talla {item.talla}</span>
                        </div>
                        <p className="text-xs font-bold text-indigo-600 mt-1">
                          ${(item.precio * (Number(item.cantidad) || 0)).toLocaleString()} COP
                        </p>
                      </div>

                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
                        <button
                          onClick={() => updateCartItemQty(index, -1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded"
                        >
                          <Minus size={12} />
                        </button>
                        <input
                          type="text"
                          value={item.cantidad}
                          onChange={(e) => handleSetCartItemQty(index, e.target.value)}
                          onBlur={() => {
                            if (item.cantidad === '') {
                              removeFromCart(index);
                            }
                          }}
                          className="text-xs font-black w-8 text-center bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded p-0"
                        />
                        <button
                          onClick={() => updateCartItemQty(index, 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 rounded"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(index)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex justify-between font-black text-slate-900 text-base">
                <span>Total a Cobrar:</span>
                <span className="text-indigo-600">
                  ${cart.reduce((a, b) => a + (b.precio * (Number(b.cantidad) || 0)), 0).toLocaleString()} COP
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition ${cart.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
              >
                <CreditCard size={16} /> Confirmar Venta
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// ----------------------------------------------------
// TARJETA DE CATÁLOGO
// ----------------------------------------------------
function JeanCatalogCard({ jean, userRole, onAddToCart }) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedTalla, setSelectedTalla] = useState('8');

  const varianteActual = jean.variantes[selectedColorIdx];
  const stockTallaSeleccionada = varianteActual.tallas[selectedTalla] || 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group">
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img src={jean.imagen} alt={jean.nombre} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-mono text-indigo-700 font-bold shadow-sm">
            {jean.id}
          </div>
          <div className="absolute top-3 right-3 bg-emerald-600 text-white font-extrabold px-2.5 py-1 rounded-lg text-xs shadow-sm">
            ${jean.precio.toLocaleString()} COP
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{jean.categoria}</span>
            <h4 className="text-base font-bold text-slate-900">{jean.nombre}</h4>
          </div>

          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">1. Seleccionar Color:</p>
            <div className="flex flex-wrap gap-2">
              {jean.variantes.map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition ${selectedColorIdx === idx
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <span className="w-3.5 h-3.5 rounded-md border border-slate-300" style={{ backgroundColor: v.hex }} />
                  <span>{v.colorNombre}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">2. Talla deseada:</label>
            <select
              value={selectedTalla}
              onChange={(e) => setSelectedTalla(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-none transition cursor-pointer"
            >
              {Object.keys(varianteActual.tallas).map((tallaKey) => {
                const qty = varianteActual.tallas[tallaKey];
                return (
                  <option key={tallaKey} value={tallaKey}>
                    Talla {tallaKey} — ({qty > 0 ? `${qty} disp.` : 'Agotada'})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Disponibilidad:</span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${stockTallaSeleccionada > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                {stockTallaSeleccionada > 0 ? `${stockTallaSeleccionada} Und` : 'Agotado'}
              </span>
            </div>

            {userRole === 'ventas' && (
              <button
                type="button"
                disabled={stockTallaSeleccionada <= 0}
                onClick={() => onAddToCart(jean, varianteActual.colorNombre, varianteActual.hex, selectedTalla, 1)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${stockTallaSeleccionada > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
              >
                <ShoppingCart size={14} /> Agregar al Carrito
              </button>
            )}

            {userRole === 'admin' && (
              <div className="text-[11px] text-purple-700 font-semibold text-center bg-purple-50 border border-purple-100 py-1.5 rounded-lg flex items-center justify-center gap-1">
                <EyeIcon size={13} /> Modo Inspección Administrador
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// BODEGA POR VARIANTE (TODAS LAS TALLAS CON ENTRADA DIRECTA)
// ----------------------------------------------------
function BodegaColorRow({ jeanId, variante, onSetStockDirectly }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-md border border-slate-300" style={{ backgroundColor: variante.hex }} />
          <span className="font-bold text-slate-900 text-xs">{variante.colorNombre}</span>
        </div>
        <span className="text-[11px] font-medium text-slate-500">
          Total Color: <strong className="text-slate-800">{Object.values(variante.tallas).reduce((a, b) => a + b, 0)} Und</strong>
        </span>
      </div>

      {/* GRILLA CON ENTRADA DIRECTA DE CADA TALLA SIN BOTONES */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white p-3 rounded-xl border border-slate-200">
        {Object.keys(variante.tallas).map((tallaKey) => (
          <div key={tallaKey} className="flex flex-col items-center bg-slate-50/70 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase mb-1">Talla {tallaKey}</span>
            <input
              type="number"
              min="0"
              value={variante.tallas[tallaKey]}
              onChange={(e) => onSetStockDirectly(jeanId, variante.colorNombre, tallaKey, e.target.value)}
              className="w-full text-center text-xs font-black text-slate-900 bg-white border border-slate-200 rounded-lg py-1.5 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// TARJETA EDICIÓN DE PRECIO (ADMIN)
// ----------------------------------------------------
function AdminPriceCard({ jean, onUpdatePrice }) {
  const [editingPrice, setEditingPrice] = useState(jean.precio);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdatePrice(jean.id, editingPrice);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
      <div className="flex items-center gap-3">
        <img src={jean.imagen} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
        <div>
          <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 font-bold">{jean.id}</span>
          <h5 className="font-bold text-slate-900 text-xs mt-0.5">{jean.nombre}</h5>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase block">Precio COP Actual</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="1000"
            value={editingPrice}
            onChange={(e) => setEditingPrice(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition shadow-sm"
          >
            {savedSuccess ? <Check size={14} /> : <Edit3 size={14} />}
            <span>{savedSuccess ? 'Guardado' : 'Guardar'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}