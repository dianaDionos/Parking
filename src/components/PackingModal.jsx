import React, { useState, useEffect } from "react";

export default function PackingModal({ isOpen, onClose, onConfirm, paquete }) {
  const [recibidoPor, setRecibidoPor] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRecibidoPor("");
      setDescripcion("");
    }
  }, [isOpen]);

  if (!isOpen || !paquete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full relative">
        <button
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-700"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-4 text-yellow-700">
          Entregar paquete a residente
        </h3>
        <div className="mb-3">
          <div className="text-sm text-slate-700 mb-2">
            <b>Residente:</b> {paquete.nombre} <br />
            <b>Apto:</b> {paquete.apto} <br />
            <b>Interior:</b> {paquete.interior}
          </div>
          <label className="block text-sm font-medium mb-1">
            Nombre de quien recibe <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={recibidoPor}
            onChange={(e) => setRecibidoPor(e.target.value)}
            placeholder="Ej: Juan Pérez, Familia Gómez..."
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Descripción (opcional)
          </label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Observaciones o detalles"
          />
        </div>
        <button
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-lg transition"
          onClick={() => {
            onConfirm({
              recibidoPor,
              descripcion,
              fechaRecepcion: new Date().toISOString(),
            });
          }}
          disabled={!recibidoPor}
        >
          Confirmar entrega
        </button>
      </div>
    </div>
  );
}
