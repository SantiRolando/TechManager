// src/components/RepairDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function RepairDetail() {
  const { id } = useParams();
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para controlar la edición del diagnóstico
  const [isEditing, setIsEditing] = useState(false);
  const [diagnosticText, setDiagnosticText] = useState('');

  // Estados para controlar la edición del costo
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [costText, setCostText] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRepair = async () => {
      try {
        const response = await api.get(`/repairs/${id}`);
        setRepair(response.data);
        setDiagnosticText(response.data.diagnostic || '');
        setCostText(response.data.estimasted_cost || '');
      } catch (error) {
        console.error("Error al cargar la reparación:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepair();
  }, [id]);

  // Función para guardar el diagnóstico editado sin perder los datos relacionados
  const handleSaveDiagnostic = async () => {
    try {
      setSaving(true);
      const response = await api.put(`/repairs/${id}`, {
        diagnostic: diagnosticText,
      });

      const updatedRepairData = response.data.repair || response.data;

      setRepair(prevRepair => ({
        ...prevRepair,
        ...updatedRepairData,
        device: prevRepair.device 
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar el diagnóstico:", error);
      alert("Hubo un error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  // Función para guardar el costo editado
  const handleSaveCost = async () => {
    try {
      setSaving(true);
      const response = await api.put(`/repairs/${id}`, {
        estimasted_cost: costText,
      });

      const updatedRepairData = response.data.repair || response.data;

      setRepair(prevRepair => ({
        ...prevRepair,
        ...updatedRepairData,
        device: prevRepair.device 
      }));

      setIsEditingCost(false);
    } catch (error) {
      console.error("Error al guardar el costo:", error);
      alert("Hubo un error al actualizar el costo.");
    } finally {
      setSaving(false);
    }
  };

  // Función para cambiar el estado de la reparación directamente
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const response = await api.put(`/repairs/${id}`, {
        status: newStatus,
      });

      const updatedRepairData = response.data.repair || response.data;

      setRepair(prevRepair => ({
        ...prevRepair,
        ...updatedRepairData,
        device: prevRepair.device
      }));
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("Hubo un error al cambiar el estado de la reparación.");
    }
  };

  // Función para disparar la impresión nativa del navegador (Guardar como PDF)
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#121417] text-slate-400 font-medium">
        Cargando detalles de la reparación...
      </div>
    );
  }

  if (!repair) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center bg-[#181c23] p-8 rounded-2xl shadow-sm border border-slate-800">
        <p className="text-slate-300 font-medium mb-4">No se encontró la reparación solicitada.</p>
        <Link to="/" className="text-emerald-400 hover:underline text-sm font-semibold">&larr; Volver al Tablero</Link>
      </div>
    );
  }

  const device = repair.device || {};
  const client = device.client || {};

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
    <div className="max-w-3xl mx-auto bg-[#181c23] text-slate-300 p-8 rounded-3xl shadow-xl border border-slate-800 my-10 print:m-0 print:p-4 print:max-w-none print:bg-white print:text-slate-900 print:border-none print:shadow-none">
      
      {/* Estilos para impresión limpia en PDF */}
      <style type="text/css" media="print">
        {`
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-border { border: 1px solid #cbd5e1 !important; background: #f8fafc !important; }
        `}
      </style>

      {/* Botones superiores de Navegación y Exportar (Ocultos al imprimir) */}
      <div className="flex justify-between items-center mb-6 no-print">
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
          <span className="mr-1">&larr;</span> Volver al Tablero
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-sm"
        >
          🖨️ Imprimir / Guardar PDF
        </button>
      </div>

      {/* 🏢 SECCIÓN DE LOGO Y ENCABEZADO DE LA EMPRESA */}
      <div className="flex justify-between items-center pb-6 mb-6 border-b border-slate-800 print:border-slate-300">
        <div className="flex items-center gap-4">
          <img 
            src="/logo.png" 
            alt="Logo Empresa" 
            className="w-14 h-14 object-contain rounded-xl bg-slate-800 p-1 border border-slate-700 print:bg-transparent print:border-none" 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div>
            <h1 className="text-lg font-black text-slate-100 print:text-slate-900 tracking-wide">Servicio Técnico</h1>
            <p className="text-xs text-slate-400 print:text-slate-600">Comprobante Oficial de Reparación</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 print:text-slate-600">Fecha de Emisión</p>
          <p className="text-xs font-semibold text-slate-300 print:text-slate-900">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
      
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800 print:border-slate-300">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase print:text-slate-600">Orden de Trabajo</span>
          <h2 className="text-3xl font-extrabold text-slate-100 print:text-slate-900">Reparación #{repair.id}</h2>
        </div>

        {/* Selector de Estado / Badge de impresión */}
        <div className="flex items-center gap-3">
          <div className="no-print">
            <select 
              value={repair.status || 'Ingresado'} 
              onChange={handleStatusChange}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ${getStatusBadge(repair.status)}`}
            >
              <option value="Ingresado" className="bg-[#181c23] text-slate-200">Ingresado</option>
              <option value="Pendiente de Presupuesto" className="bg-[#181c23] text-slate-200">Pendiente de Presupuesto</option>
              <option value="En Revisión" className="bg-[#181c23] text-slate-200">En Revisión</option>
              <option value="Entregado" className="bg-[#181c23] text-slate-200">Entregado</option>
            </select>
          </div>
          {/* Versión estática visible únicamente al imprimir */}
          <div className="hidden print:block px-3 py-1 rounded-lg text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300">
            Estado: {repair.status || 'Ingresado'}
          </div>
        </div>
      </div>

      {/* Secciones de Información */}
      <div className="space-y-6">
        
        {/* Cliente */}
        <div className="bg-[#121417] p-6 rounded-2xl border border-slate-800 print-border">
          <h4 className="text-sm font-bold tracking-wide text-slate-500 uppercase mb-3 print:text-slate-700">Información del Cliente</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500 font-medium print:text-slate-600">Nombre</p>
              <p className="text-sm font-semibold text-slate-200 print:text-slate-900">{client.nombre || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium print:text-slate-600">Teléfono</p>
              <p className="text-sm font-semibold text-slate-200 print:text-slate-900">{client.telefono || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium print:text-slate-600">Email</p>
              <p className="text-sm font-semibold text-slate-200 truncate print:text-slate-900">{client.email || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Dispositivo */}
        <div className="bg-[#121417] p-6 rounded-2xl border border-slate-800 print-border">
          <h4 className="text-sm font-bold tracking-wide text-slate-500 uppercase mb-3 print:text-slate-700">Información del Dispositivo</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 font-medium print:text-slate-600">Tipo / Equipo</p>
              <p className="text-sm font-semibold text-slate-200 print:text-slate-900">{device.type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium print:text-slate-600">Marca y Modelo</p>
              <p className="text-sm font-semibold text-slate-200 print:text-slate-900">{device.brand} {device.model}</p>
            </div>
            {/* Oculto al imprimir mediante print:hidden */}
            <div className="print:hidden">
              <p className="text-xs text-slate-500 font-medium">Nº de Serie</p>
              <p className="text-sm font-semibold text-slate-200 font-mono">{device.serial_number || 'N/A'}</p>
            </div>
            {/* Oculto al imprimir mediante print:hidden */}
            <div className="print:hidden">
              <p className="text-xs text-slate-500 font-medium">Contraseña</p>
              <p className="text-sm font-semibold text-slate-200 font-mono">{device.password_device || 'Sin contraseña'}</p>
            </div>
          </div>
        </div>

        {/* Diagnóstico y Costos */}
        <div className="bg-[#121417] p-6 rounded-2xl border border-slate-800 print-border">
          <h4 className="text-sm font-bold tracking-wide text-slate-500 uppercase mb-3 print:text-slate-700">Diagnóstico y Costos</h4>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 font-medium print:text-slate-600">Problema Reportado</p>
              <p className="text-sm text-slate-300 mt-0.5 bg-[#181c23] p-3 rounded-xl border border-slate-800 print:bg-white print:border-slate-300 print:text-slate-900">{repair.problem_description || 'N/A'}</p>
            </div>

            {/* Sección de Diagnóstico Editable */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs text-slate-500 font-medium print:text-slate-600">Diagnóstico Técnico</p>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors no-print"
                  >
                    ✏️ Editar Diagnóstico
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3 mt-1 no-print">
                  <textarea
                    value={diagnosticText}
                    onChange={(e) => setDiagnosticText(e.target.value)}
                    rows="3"
                    className="w-full p-3 text-sm bg-[#181c23] text-slate-200 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Escribe el diagnóstico técnico..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setDiagnosticText(repair.diagnostic || '');
                      }}
                      className="px-4 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveDiagnostic}
                      disabled={saving}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-300 mt-0.5 bg-[#181c23] p-3 rounded-xl border border-slate-800 min-h-[46px] print:bg-white print:border-slate-300 print:text-slate-900">
                  {repair.diagnostic || <span className="text-slate-500 italic print:text-slate-400">Sin diagnóstico registrado todavía.</span>}
                </p>
              )}
            </div>

            {/* Sección de Costo Editable */}
            <div className="pt-2 border-t border-slate-800 print:border-slate-300">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-400 print:text-slate-600">Costo / Presupuesto</span>
                {!isEditingCost && (
                  <button 
                    onClick={() => setIsEditingCost(true)} 
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors no-print"
                  >
                    ✏️ Editar Costo
                  </button>
                )}
              </div>

              {isEditingCost ? (
                <div className="flex items-center gap-2 mt-2 no-print">
                  <input
                    type="number"
                    value={costText}
                    onChange={(e) => setCostText(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-2.5 text-sm bg-[#181c23] text-slate-200 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleSaveCost}
                    disabled={saving}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors whitespace-nowrap disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingCost(false);
                      setCostText(repair.estimasted_cost || '');
                    }}
                    className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs text-slate-500 font-medium print:text-slate-600">Monto Actual</span>
                  <span className="text-xl font-extrabold text-emerald-400 print:text-emerald-700">${repair.estimasted_cost || '0.00'}</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}