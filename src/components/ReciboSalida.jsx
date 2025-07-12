import React from "react";

const ReciboSalida = ({ visitor }) => {
  if (!visitor) return null;
  return (
    <div className="w-[320px] mx-auto bg-white rounded-xl shadow p-4 text-xs font-mono border border-slate-200">
      <div className="text-center mb-2">
        <h2 className="text-base font-bold text-slate-700">RECIBO DE SALIDA</h2>
        <div className="text-[10px] text-slate-500">
          Conjunto Residencial Toledo
        </div>
        <div className="text-[10px] text-slate-500">NIT: 900.000.000-1</div>
        <div className="text-[10px] text-slate-500">Cra 1 # 23-45, Bogotá</div>
      </div>
      <div className="mb-1">
        <span className="font-bold">Visitante:</span> {visitor.name}
      </div>
      <div className="mb-1">
        <span className="font-bold">Apto:</span>{" "}
        {visitor.resident?.apartment || "-"}{" "}
        <span className="ml-2 font-bold">Interior:</span>{" "}
        {visitor.resident?.interior || "-"}
      </div>
      <div className="mb-1">
        <span className="font-bold">Ingreso:</span>{" "}
        {visitor.date
          ? new Date(visitor.date.replace(" ", "T")).toLocaleString()
          : "-"}
      </div>
      <div className="mb-1">
        <span className="font-bold">Salida:</span>{" "}
        {visitor.salida ? new Date(visitor.salida).toLocaleString() : "-"}
      </div>
      <div className="border-b border-dashed my-2" />
      <div className="text-[10px] text-center mt-2 text-slate-400">
        Gracias por su visita
      </div>
    </div>
  );
};

export default ReciboSalida;
