// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import App from '../App';
import ClienteForm from '../components/ClienteForm';
import RepairForm from '../components/RepairForm';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      
      <Route path="/nuevo-cliente" element={
        <div className="p-8 bg-gray-50 min-h-screen">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 font-semibold px-4 py-2 rounded-full border border-blue-200 hover:bg-blue-100 transition shadow-sm mb-6"
          >
            &larr; Volver al inicio
          </Link>
          <ClienteForm />
        </div>
      } />

      <Route path="/nuevo-equipo" element={
        <div className="p-8 bg-gray-50 min-h-screen">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-green-50 text-green-700 font-semibold px-4 py-2 rounded-full border border-green-200 hover:bg-green-100 transition shadow-sm mb-6"
          >
            &larr; Volver al inicio
          </Link>
          <RepairForm />
        </div>
      } />
    </Routes>
  );
}