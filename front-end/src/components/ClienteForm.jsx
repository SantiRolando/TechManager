import React, { useState } from 'react';
import api from '../api/axios';

export default function ClienteForm({ onClienteCreado }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/clientes', formData);
      alert('¡Cliente guardado con éxito!');
      setFormData({ nombre: '', email: '', telefono: '', direccion: ''});
      if (onClienteCreado) onClienteCreado(response.data);
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      alert('Hubo un error al guardar el cliente.');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Registrar Nuevo Cliente</h3>
        <p className="text-gray-500 text-sm mt-1">Ingresa los datos de contacto del cliente para asociarlo a reparaciones.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
          <input 
            type="text" 
            value={formData.nombre} 
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} 
            placeholder="Ej. Juan Pérez"
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-800 bg-gray-50/50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            placeholder="Ej. juan@email.com"
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-800 bg-gray-50/50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
          <input 
            type="text" 
            value={formData.telefono} 
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} 
            placeholder="Ej. 099123456"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-800 bg-gray-50/50"
          />
        </div>
         
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
          <input 
            type="text" 
            value={formData.direccion} 
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} 
            placeholder="Ej. Av. Principal 123"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-800 bg-gray-50/50"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
        >
          Guardar Cliente
        </button>
      </form>
    </div>
  );
}