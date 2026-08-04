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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl font-bold text-blue-900 animate-pulse">Cargando taller...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      
      {/* Encabezado */}
      <header className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">TechManager</h1>
          <p className="text-gray-600 text-lg">Tablero de Control del Taller</p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-inner">
           Técnico: Admin
        </div>
      </header>

      {/* Botones de acción rápida */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link to="/nuevo-cliente" className="group bg-white border border-gray-200 hover:bg-blue-50 p-5 rounded-2xl shadow-sm flex items-center justify-between transition duration-150">
          <span className="text-xl font-bold text-blue-800">➕ Nuevo Cliente</span>
          <span className="bg-blue-100 text-blue-600 p-2 rounded-full group-hover:translate-x-1 transition-transform">&rarr;</span>
        </Link>
        <Link to="/nuevo-equipo" className="group bg-white border border-gray-200 hover:bg-green-50 p-5 rounded-2xl shadow-sm flex items-center justify-between transition duration-150">
          <span className="text-xl font-bold text-green-800">🔧 Nueva Reparación</span>
          <span className="bg-green-100 text-green-600 p-2 rounded-full group-hover:translate-x-1 transition-transform">&rarr;</span>
        </Link>
      </div>

      {/* SECCIÓN: EQUIPOS EN TALLER */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Equipos en Proceso</h2>
        </div>
        
        {equipos.length === 0 ? (
          <p className="text-gray-500 bg-white p-6 rounded-3xl border border-gray-100 text-center">No hay equipos registrados todavía.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {equipos.map((repair) => {
              // Extraemos los datos correctamente respetando la relación anidada (repair -> device -> client)
              const device = repair.device || {};
              const client = device.client || {};

              return (
                <div key={repair.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                        {repair.status || 'Ingresado'}
                      </span>
                      {/* Mostramos el tipo, marca y modelo del dispositivo asociado */}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {device.type ? `${device.type}: ${device.brand} ${device.model}` : 'Dispositivo'}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                         {client.nombre ? client.nombre.charAt(0) : 'C'}
                      </div>
                      <div>
                          {/* Aquí leemos el nombre del cliente desde device.client */}
                          <p className="font-medium text-gray-800">{client.nombre || 'Sin cliente asignado'}</p>
                          <p className="text-sm text-gray-500">{client.telefono || client.email || ''}</p>
                      </div>
                  </div>

                  {/* Usamos problem_description que es el campo real de tu tabla repairs */}
                  <p className="text-gray-700 text-sm"><span className="font-semibold">Falla:</span> {repair.problem_description}</p>
                  
                  <div className="mt-4 text-xs text-gray-400 text-right">
                    Ingreso: {repair.created_at ? new Date(repair.created_at).toLocaleDateString() : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECCIÓN: CLIENTES */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Últimos Clientes</h2>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          {clientes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay clientes registrados.</p>
          ) : (
            <ul className="space-y-4">
              {clientes.map((cliente) => (
                <li key={cliente.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-4">
                    <img src={`https://i.pravatar.cc/40?u=${cliente.email || cliente.id}`} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm"/>
                    <div>
                      <p className="font-semibold text-gray-900">{cliente.nombre}</p>
                      <p className="text-sm text-gray-500">{cliente.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700">{cliente.telefono}</span>
                      <button className="text-blue-600 text-xs font-medium px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition">Ver Ficha</button>
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