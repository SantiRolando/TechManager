// src/App.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api/axios';

export default function App() {
  const [equipos, setEquipos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resEquipos = await api.get('/repairs');
        const resClientes = await api.get('/clientes');
        
        setEquipos(resEquipos.data);
        setClientes(resClientes.data);
      } catch (error) {
        console.error("Error al cargar los datos del taller:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121417] flex items-center justify-center">
        <p className="text-xl font-bold text-emerald-400 animate-pulse">Cargando taller...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121417] text-slate-300 p-4 md:p-8">
      
      {/* Encabezado */}
      <header className="mb-8 flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">TechManager</h1>
          <p className="text-slate-400 text-base font-medium">Tablero de Control del Taller</p>
        </div>
        <div className="text-xs font-semibold text-emerald-400 bg-[#1b2028] px-4 py-2 rounded-full border border-slate-800 shadow-sm">
           Técnico: Admin
        </div>
      </header>

      {/* Botones de acción rápida */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link to="/nuevo-cliente" className="group bg-[#181c23] border border-slate-800 hover:border-emerald-500/50 hover:bg-[#1e232d] p-5 rounded-2xl shadow-sm flex items-center justify-between transition duration-150">
          <span className="text-lg font-bold text-slate-100">➕ Nuevo Cliente</span>
          <span className="bg-emerald-950 text-emerald-400 p-2 rounded-full group-hover:translate-x-1 transition-transform border border-emerald-900/50">&rarr;</span>
        </Link>
        <Link to="/nuevo-equipo" className="group bg-[#181c23] border border-slate-800 hover:border-teal-500/50 hover:bg-[#1e232d] p-5 rounded-2xl shadow-sm flex items-center justify-between transition duration-150">
          <span className="text-lg font-bold text-slate-100">🔧 Nueva Reparación</span>
          <span className="bg-teal-950 text-teal-400 p-2 rounded-full group-hover:translate-x-1 transition-transform border border-teal-900/50">&rarr;</span>
        </Link>
      </div>

      {/* SECCIÓN: EQUIPOS EN TALLER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {equipos.map((repair) => {
          const device = repair.device || {};
          const client = device.client || {};

          return (
            <Link 
              to={`/reparacion/${repair.id}`} 
              key={repair.id} 
              className="bg-[#181c23] p-6 rounded-3xl shadow-sm border border-slate-800 hover:shadow-md transition-all hover:border-emerald-500/50 block"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block bg-amber-950/80 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-2 border border-amber-900/50">
                    {repair.status || 'Ingresado'}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100">
                    {device.type ? `${device.type}: ${device.brand} ${device.model}` : 'Dispositivo'}
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-[#121417] p-3 rounded-2xl border border-slate-800/80 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/30 shadow-sm">
                     {client.nombre ? client.nombre.charAt(0) : 'C'}
                  </div>
                  <div>
                      <p className="font-semibold text-slate-200">{client.nombre || 'Sin cliente asignado'}</p>
                      <p className="text-xs text-slate-400">{client.telefono || client.email || ''}</p>
                  </div>
              </div>

              <p className="text-slate-300 text-sm"><span className="font-semibold text-slate-200">Falla:</span> {repair.problem_description}</p>
              
              <div className="mt-4 text-xs text-slate-500 text-right">
                Ingreso: {repair.created_at ? new Date(repair.created_at).toLocaleDateString() : ''}
              </div>
            </Link>
          );
        })}
      </div>

     {/* SECCIÓN: CLIENTES */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-100 mb-5">Últimos Clientes</h2>
        <div className="bg-[#181c23] rounded-3xl shadow-sm border border-slate-800 p-6">
          {clientes.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No hay clientes registrados.</p>
          ) : (
            <ul className="space-y-4">
              {clientes.map((cliente) => (
                <li key={cliente.id} className="flex items-center justify-between p-3 hover:bg-[#1e232d] rounded-2xl transition-colors border-b border-slate-800/60 last:border-b-0">
                  <div className="flex items-center gap-4">
                    <img src={`https://i.pravatar.cc/40?u=${cliente.email || cliente.id}`} alt="Avatar" className="w-12 h-12 rounded-full border border-slate-700 shadow-sm"/>
                    <div>
                      <p className="font-semibold text-slate-200">{cliente.nombre}</p>
                      <p className="text-xs text-slate-400">{cliente.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400 hidden sm:inline">{cliente.telefono}</span>
                      <Link 
                        to={`/cliente/${cliente.id}`} 
                        className="text-emerald-400 text-xs font-bold px-3.5 py-1.5 bg-emerald-950/60 rounded-xl border border-emerald-900/60 hover:bg-emerald-900/50 transition"
                      >
                        Ver Ficha
                      </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

    </div>
  );
}