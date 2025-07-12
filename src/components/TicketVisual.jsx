import React from "react";

const TicketVisual = ({ ticket }) => {
  if (!ticket) return null;
  return (
    <div className="w-[320px] mx-auto bg-white rounded-xl shadow p-4 text-xs font-mono border border-indigo-200 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 via-indigo-200 to-indigo-400 rounded-t-xl" />
      <div className="text-center mb-2 mt-2">
        <h2 className="text-base font-bold text-indigo-700 tracking-widest">
          TICKET DE ENTRADA
        </h2>
        <div className="text-[10px] text-slate-500">
          Conjunto Residencial Toledo
        </div>
        <div className="text-[10px] text-slate-500">NIT: 900.000.000-1</div>
        <div className="text-[10px] text-slate-500">Cra 1 # 23-45, Bogotá</div>
      </div>
      <div className="flex justify-between mb-1">
        <span className="font-bold">Ticket:</span>
        <span>{ticket.ticketNumber || "-"}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="font-bold">Placa:</span>
        <span>{ticket.licensePlate}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="font-bold">Tipo:</span>
        <span>{ticket.vehicleType}</span>
      </div>
      <div className="mb-1">
        <span className="font-bold">Visitante:</span> {ticket.visitorName}
      </div>
      <div className="mb-1">
        <span className="font-bold">Apto:</span> {ticket.apartment}{" "}
        <span className="ml-2 font-bold">Interior:</span> {ticket.interior}
      </div>
      <div className="mb-1">
        <span className="font-bold">Ingreso:</span> {ticket.entryDate}{" "}
        {ticket.entryHour}
      </div>
      <div className="border-b border-dashed my-2" />
      <div className="flex justify-between mb-1">
        <span>Tarifa parqueo</span>
        <span>${ticket.parkingFee?.toLocaleString()}</span>
      </div>
      <div className="text-[10px] text-center mt-2 text-indigo-400 font-bold tracking-widest">
        ¡NO PIERDA ESTE TICKET!
      </div>
      <div className="text-[10px] text-center mt-1 text-slate-400">
        Presentar a la salida para facturación
      </div>
    </div>
  );
};

export default TicketVisual;
