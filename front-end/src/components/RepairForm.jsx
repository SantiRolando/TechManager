// src/components/RepairForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function RepairForm({ onRepairCreado }) {
  // Modo: 'nuevo' o 'existente'
  const [modoEquipo, setModoEquipo] = useState('nuevo');

  const [formData, setFormData] = useState({
    client_id: '',
    device_id: '',
    // Datos de Device
    type: '',
    brand: '',
    model: '',
    serial_number: '',
    password_device: '',
    description: '', // Descripción del dispositivo o accesorios
    // Datos de Repair
    problem_description: '',
    diagnostic: '',
    status: 'Ingresado', // Estado por defecto
    estimasted_cost: '',
  });
  
  const [clientes, setClientes] = useState([]);
  const [dispositivosCliente, setDispositivosCliente] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingDispositivos, setLoadingDispositivos] = useState(false);

  // Cargar clientes al iniciar
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Error al cargar los clientes:', error);
      } finally {
        setLoadingClientes(false);
      }
    };
    fetchClientes();
  }, []);

  // Cargar dispositivos si elige un cliente existente
  useEffect(() => {
    if (modoEquipo === 'existente' && formData.client_id) {
      const fetchDispositivos = async () => {
        setLoadingDispositivos(true);
        try {
          const response = await api.get(`/clientes/${formData.client_id}/devices`);
          setDispositivosCliente(response.data);
        } catch (error) {
          console.error('Error al cargar dispositivos del cliente:', error);
          setDispositivosCliente([]);
        } finally {
          setLoadingDispositivos(false);
        }
      };
      fetchDispositivos();
    } else {
      setDispositivosCliente([]);
    }
  }, [formData.client_id, modoEquipo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client_id) {
      alert('Por favor, selecciona un cliente.');
      return;
    }

    if (modoEquipo === 'existente' && !formData.device_id) {
      alert('Por favor, selecciona el dispositivo existente del cliente.');
      return;
    }

    // Estructuramos el payload exactamente alineado con los fillable de tus modelos
    const payload = {
      client_id: formData.client_id,
      problem_description: formData.problem_description,
      diagnostic: formData.diagnostic,
      status: formData.status,
      estimasted_cost: formData.estimasted_cost,
    };

    if (modoEquipo === 'existente') {
      payload.device_id = formData.device_id;
    } else {
      payload.type = formData.type;
      payload.brand = formData.brand;
      payload.model = formData.model;
      payload.serial_number = formData.serial_number;
      payload.password_device = formData.password_device;
      payload.description = formData.description; // Descripción general del equipo
    }

    try {
      const response = await api.post('/repairs', payload);
      alert('¡Ingreso a taller registrado con éxito!');
      setFormData({
        client_id: '',
        device_id: '',
        type: '',
        brand: '',
        model: '',
        serial_number: '',
        password_device: '',
        description: '',
        problem_description: '',
        diagnostic: '',
        status: 'Ingresado',
        estimasted_cost: '',
      });
      if (onRepairCreado) onRepairCreado(response.data);
    } catch (error) {
      console.error('Error al registrar reparación:', error);
      alert('Hubo un error al registrar la reparación.');
    }
  };

  const clienteSeleccionado = clientes.find(c => c.id == formData.client_id);

  return (
    <div className="max-w-4xl mx-auto bg-[#181c23] text-slate-300 p-8 rounded-3xl shadow-sm border border-slate-800">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-100">Ingreso a Taller</h3>
          <p className="text-slate-400 text-sm mt-1">Registra los datos de la reparación y del equipo asociado.</p>
        </div>

        {/* Selector de Modo */}
        <div className="flex bg-[#121417] p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => { setModoEquipo('nuevo'); setFormData({ ...formData, device_id: '' }); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${modoEquipo === 'nuevo' ? 'bg-[#1e232d] text-emerald-400 shadow-sm border border-slate-700/50' : 'text-slate-400 hover:text-slate-200'}`}
          >
            + Equipo Nuevo
          </button>
          <button
            type="button"
            onClick={() => { setModoEquipo('existente'); setFormData({ ...formData, type: '', brand: '', model: '', serial_number: '', password_device: '', description: '' }); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${modoEquipo === 'existente' ? 'bg-[#1e232d] text-emerald-400 shadow-sm border border-slate-700/50' : 'text-slate-400 hover:text-slate-200'}`}
          >
            📂 Equipo Existente
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: Datos del Equipo y de la Reparación */}
        <div className="space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente Seleccionado</label>
              <div className={`w-full px-3 py-2 rounded-xl border text-sm font-medium ${clienteSeleccionado ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' : 'bg-[#121417] border-slate-800 text-slate-500'}`}>
                {clienteSeleccionado ? `✓ ${clienteSeleccionado.nombre}` : '⚠️ Selecciona un cliente a la derecha'}
              </div>
            </div>

            {/* SECCIÓN SI EL EQUIPO ES EXISTENTE */}
            {modoEquipo === 'existente' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Seleccionar Equipo del Cliente</label>
                <select
                  value={formData.device_id || ''}
                  onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 bg-[#121417] text-xs"
                >
                  <option value="">{loadingDispositivos ? 'Cargando equipos...' : '-- Selecciona un equipo --'}</option>
                  {dispositivosCliente.map((dev) => (
                    <option key={dev.id} value={dev.id}>
                      {dev.type} - {dev.brand} {dev.model} {dev.serial_number ? `(S/N: ${dev.serial_number})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* SECCIÓN SI EL EQUIPO ES NUEVO */}
            {modoEquipo === 'nuevo' && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo</label>
                    <input 
                      type="text" 
                      value={formData.type || ''} 
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                      placeholder="Notebook" 
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 bg-[#121417] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Marca</label>
                    <input 
                      type="text" 
                      value={formData.brand || ''} 
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })} 
                      placeholder="Lenovo" 
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 bg-[#121417] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Modelo</label>
                    <input 
                      type="text" 
                      value={formData.model || ''} 
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })} 
                      placeholder="G50" 
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 bg-[#121417] text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nº Serie / IMEI</label>
                    <input 
                      type="text" 
                      value={formData.serial_number || ''} 
                      onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })} 
                      placeholder="Opcional" 
                      className="w-full px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 bg-[#121417] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña / PIN</label>
                    <input 
                      type="text" 
                      value={formData.password_device || ''} 
                      onChange={(e) => setFormData({ ...formData, password_device: e.target.value })} 
                      placeholder="Si aplica" 
                      className="w-full px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 bg-[#121417] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción / Accesorios del Equipo</label>
                  <input 
                    type="text" 
                    value={formData.description || ''} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Ej. Con cargador, rayas de uso..." 
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 bg-[#121417] text-xs"
                  />
                </div>
              </>
            )}

            {/* CAMPOS DE LA REPARACIÓN */}
            <div className="border-t pt-3 mt-3 border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Problema Reportado</label>
              <textarea 
                value={formData.problem_description || ''} 
                onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })} 
                placeholder="Describe la falla que reporta el cliente..."
                rows="2"
                required 
                className="w-full px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 bg-[#121417] text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Estado Inicial</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 bg-[#121417] text-xs"
                >
                  <option value="Ingresado">Ingresado</option>
                  <option value="En Revisión">En Revisión</option>
                  <option value="Pendiente de Presupuesto">Pendiente de Presupuesto</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Costo Estimado ($)</label>
                <input 
                  type="number" 
                  value={formData.estimasted_cost || ''} 
                  onChange={(e) => setFormData({ ...formData, estimasted_cost: e.target.value })} 
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 bg-[#121417] text-xs"
                />
              </div>
            </div>

          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer mt-3"
          >
            Registrar Ingreso
          </button>
        </div>

        {/* COLUMNA DERECHA: Lista interactiva de Clientes */}
        <div className="bg-[#121417] p-5 rounded-2xl border border-slate-800 flex flex-col h-[560px]">
          <label className="block text-sm font-semibold text-slate-200 mb-3">Seleccionar Dueño del Equipo</label>
          
          <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
            {loadingClientes ? (
              <p className="text-slate-500 text-sm text-center py-10">Cargando clientes...</p>
            ) : clientes.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-10">No hay clientes registrados.</p>
            ) : (
              clientes.map((cliente) => {
                const isSelected = formData.client_id == cliente.id;
                return (
                  <div
                    key={cliente.id}
                    onClick={() => setFormData({ ...formData, client_id: cliente.id, device_id: '' })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                        : 'bg-[#181c23] hover:bg-[#1e232d] border-slate-800 text-slate-200'
                    }`}
                  >
                    <div>
                      <p className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-100'}`}>{cliente.nombre}</p>
                      <p className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>{cliente.email || cliente.telefono || 'Sin datos'}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'}`}>
                      {isSelected ? 'Elegido' : 'Seleccionar'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </form>
    </div>
  );
}