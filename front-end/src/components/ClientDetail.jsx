// src/components/ClientDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ClientDetail() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await api.get(`/clientes/${id}`);
        setCliente(response.data);
      } catch (error) {
        console.error("Error al cargar el cliente:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCliente();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#121417] text-slate-400 font-medium">
        Cargando perfil del cliente...
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center bg-[#181c23] p-8 rounded-2xl shadow-sm border border-slate-800">
        <p className="text-slate-300 font-medium mb-4">No se encontró el cliente solicitado.</p>
        <Link to="/" className="text-emerald-400 hover:underline text-sm font-semibold">&larr; Volver al Tablero</Link>
      </div>
    );
  }

  const devices = cliente.devices || cliente.equipments || [];

  // Extraemos todas las reparaciones de todos los dispositivos del cliente
  const allRepairs = devices.flatMap(device => device.repairs || device.reparaciones || []);

  const getStatusBadge = (status) => {
    const styles = {
      Ingresado: 'bg-sky-950/60 text-sky-300 border-sky-900/60',
      'Pendiente de Presupuesto': 'bg-amber-950/60 text-amber-300 border-amber-900/60',
      'En Revisión': 'bg-indigo-950/60 text-indigo-300 border-indigo-900/60',
      Entregado: 'bg-emerald-950/60 text-emerald-300 border-emerald-900/60',
    };
    return styles[status] || 'bg-[#121417] text-slate-300 border-slate-800';
  };

  return (
    <div className="max-w-3xl mx-auto bg-[#181c23] text-slate-300 p-8 rounded-3xl shadow-xl border border-slate-800 my-10">
      
      {/* Botón de Retorno */}
      <Link to="/" className="inline-flex items-center text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors mb-6">
        <span className="mr-1">&larr;</span> Volver al Tablero
      </Link>
      
      {/* Cabecera Principal con Avatar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-6 border-b border-slate-800">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-3xl shadow-md shadow-emerald-950">
          {cliente.nombre ? cliente.nombre.charAt(0).toUpperCase() : 'C'}
        </div>
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Ficha de Cliente</span>
          <h2 className="text-3xl font-extrabold text-slate-100">{cliente.nombre}</h2>
          <p className="text-sm font-medium text-emerald-400 mt-0.5">{cliente.email || 'Sin correo electrónico'}</p>
        </div>
      </div>

      {/* Secciones de Información */}
      <div className="space-y-6">
        
        {/* Información de Contacto */}
        <div className="bg-[#121417] p-6 rounded-2xl border border-slate-800">
          <h4 className="text-sm font-bold tracking-wide text-slate-500 uppercase mb-3">Información de Contacto</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 font-medium">Teléfono</p>
              <p className="text-sm font-semibold text-slate-200 mt-0.5">{cliente.telefono || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Dirección</p>
              <p className="text-sm font-semibold text-slate-200 mt-0.5">{cliente.direccion || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Listado de Dispositivos del Cliente */}
        <div className="bg-[#121417] p-6 rounded-2xl border border-slate-800">
          <h4 className="text-sm font-bold tracking-wide text-slate-500 uppercase mb-4">Dispositivos Registrados</h4>
          
          {devices.length > 0 ? (
            <div className="space-y-3">
              {devices.map((device, index) => (
                <div key={device.id || index} className="bg-[#181c23] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <p className="text-sm font-bold text-slate-100">{device.brand} {device.model} <span className="text-xs font-normal text-slate-400">({device.type})</span></p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Nº Serie: {device.serial_number || 'N/A'}</p>
                  </div>
                  {device.id && (
                    <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                      ID: {device.id}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#181c23] p-4 rounded-xl border border-slate-800 text-center">
              <p className="text-sm text-slate-500 italic">Este cliente no tiene dispositivos registrados todavía.</p>
            </div>
          )}
        </div>

        {/* Historial de Reparaciones */}
        <div className="bg-[#121417] p-6 rounded-2xl border border-slate-800">
          <h4 className="text-sm font-bold tracking-wide text-slate-500 uppercase mb-4">Historial de Reparaciones</h4>
          
          {allRepairs.length > 0 ? (
            <div className="space-y-3">
              {allRepairs.map((repair) => (
                <div key={repair.id} className="bg-[#181c23] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-100">Orden #{repair.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(repair.status)}`}>
                        {repair.status || 'Sin estado'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Falla: <span className="text-slate-200">{repair.problem_description || 'N/A'}</span></p>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-sm font-extrabold text-emerald-400">${repair.estimasted_cost || '0.00'}</span>
                    <Link 
                      to={`/reparacion/${repair.id}`}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
                    >
                      Detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#181c23] p-4 rounded-xl border border-slate-800 text-center">
              <p className="text-sm text-slate-500 italic">No hay reparaciones registradas en el historial de este cliente.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}