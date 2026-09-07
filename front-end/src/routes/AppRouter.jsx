// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import App from '../App';
import ClienteForm from '../components/ClienteForm';
import RepairForm from '../components/RepairForm';
import RepairDetail from '../components/RepairDetail'; // Nueva vista de detalle de reparación
import ClientDetail from '../components/ClientDetail';   // Nueva vista de detalle de cliente

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      
      <Route path="/nuevo-cliente" element={
        <div className="p-8 bg-[#121417] min-h-screen text-slate-300">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-[#181c23] text-emerald-400 font-semibold px-4 py-2 rounded-full border border-slate-800 hover:bg-[#1e232d] transition shadow-sm mb-6"
          >
            &larr; Volver al inicio
          </Link>
          <ClienteForm />
        </div>
      } />

      <Route path="/nuevo-equipo" element={
        <div className="p-8 bg-[#121417] min-h-screen text-slate-300">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-[#181c23] text-emerald-400 font-semibold px-4 py-2 rounded-full border border-slate-800 hover:bg-[#1e232d] transition shadow-sm mb-6"
          >
            &larr; Volver al inicio
          </Link>
          <RepairForm />
        </div>
      } />

      {/* NUEVA RUTA: Detalle de Reparación */}
      <Route path="/reparacion/:id" element={
        <div className="p-8 bg-[#121417] min-h-screen text-slate-300">
          <RepairDetail />
        </div>
      } />

      {/* NUEVA RUTA: Detalle de Cliente */}
      <Route path="/cliente/:id" element={
        <div className="p-8 bg-[#121417] min-h-screen text-slate-300">
          <ClientDetail />
        </div>
      } />
    </Routes>
  );
}