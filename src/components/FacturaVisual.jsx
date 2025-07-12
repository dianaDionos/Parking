import React from "react";

const FacturaVisual = ({ billing }) => {
  if (!billing) return null;
  return (
    <div className="w-[320px] mx-auto bg-white rounded-xl shadow p-4 text-xs font-mono border border-slate-200">
      <div className="text-center mb-2">
        <h2 className="text-base font-bold text-green-700">
          RECIBO DE PARQUEADERO
        </h2>
        <div className="text-[10px] text-slate-500">
          Conjunto Residencial Toledo
        </div>
        <div className="text-[10px] text-slate-500">NIT: 900.000.000-1</div>
        <div className="text-[10px] text-slate-500">Cra 1 # 23-45, Bogotá</div>
      </div>
      <div className="flex justify-between mb-1">
        <span className="font-bold">Factura:</span>
        <span>{billing.facturaNumber}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="font-bold">CUFE:</span>
        <span className="truncate max-w-[120px]">{billing.cufe}</span>
      </div>
      <div className="border-b border-dashed my-2" />
      <div className="mb-1">
        <span className="font-bold">Visitante:</span> {billing.visitorName}
      </div>
      <div className="mb-1">
        <span className="font-bold">Placa:</span> {billing.licensePlate}
      </div>
      <div className="mb-1">
        <span className="font-bold">Apto:</span> {billing.apartment}{" "}
        <span className="ml-2 font-bold">Interior:</span> {billing.interior}
      </div>
      <div className="mb-1">
        <span className="font-bold">Ingreso:</span>{" "}
        {new Date(billing.entryTime).toLocaleString()}
      </div>
      <div className="mb-1">
        <span className="font-bold">Salida:</span>{" "}
        {new Date(billing.exitTime).toLocaleString()}
      </div>
      <div className="border-b border-dashed my-2" />
      <div className="flex justify-between mb-1">
        <span>Tarifa parqueo</span>
        <span>${billing.parkingFee?.toLocaleString()}</span>
      </div>
      {billing.lostTicketFee > 0 && (
        <div className="flex justify-between mb-1">
          <span>Multa ticket perdido</span>
          <span>${billing.lostTicketFee?.toLocaleString()}</span>
        </div>
      )}
      <div className="flex justify-between font-bold text-base mt-2">
        <span>Total</span>
        <span>${billing.total?.toLocaleString()}</span>
      </div>
      <div className="text-[10px] text-center mt-2 text-slate-400">
        Gracias por su visita
      </div>
    </div>
  );
};

export default FacturaVisual;
