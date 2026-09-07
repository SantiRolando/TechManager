import React, { useState } from 'react';
import api from '../api/axios';

export default function ClienteForm({ onClienteCreado }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/clientes', formData);
      alert('¡Cliente guardado con éxito!');
      setFormData({ nombre: '', email: '', telefono: '', direccion: '' });
      if (onClienteCreado) onClienteCreado(response.data);
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      alert('Hubo un error al guardar el cliente.');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-[#181c23] text-slate-300 p-8 rounded-3xl shadow-xl border border-slate-800 my-10">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-100">Registrar Nuevo Cliente</h3>
        <p className="text-slate-400 text-sm mt-1">Ingresa los datos de contacto del cliente para asociarlo a reparaciones.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Nombre Completo</label>
          <input 
            type="text" 
            value={formData.nombre} 
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} 
            placeholder="Ej. Juan Pérez"
            required 
            className="w-full px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-200 bg-[#121417]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Correo Electrónico</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            placeholder="Ej. juan@email.com"
            required 
            className="w-full px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-200 bg-[#121417]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Teléfono</label>
          <input 
            type="text" 
            value={formData.telefono} 
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} 
            placeholder="Ej. 099123456"
            className="w-full px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-200 bg-[#121417]"
          />
        </div>
         
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Dirección</label>
          <input 
            type="text" 
            value={formData.direccion} 
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} 
            placeholder="Ej. Av. Principal 123"
            className="w-full px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-200 bg-[#121417]"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
        >
          Guardar Cliente
        </button>
      </form>
    </div>
  );
}