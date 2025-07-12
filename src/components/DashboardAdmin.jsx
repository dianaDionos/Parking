import React from "react";
import VisitorTable from "./VisitorTable";
import ParkingTable from "./ParkingTable";

const mockAptos = [
  { apto: "302B", propietario: "Laura Ramírez", saldo: 120000 },
  { apto: "104A", propietario: "Carlos Gómez", saldo: 0 },
  { apto: "405C", propietario: "Sandra Martínez", saldo: 50000 },
];

const mockGuardias = [
  { nombre: "Juan Pérez", turno: "Mañana", activo: true },
  { nombre: "Ana Torres", turno: "Tarde", activo: false },
  { nombre: "Luis Ríos", turno: "Noche", activo: false },
];

const mockResumen = {
  totalVisitantes: 34,
  totalVehiculos: 18,
  totalRecaudo: 250000,
  totalAptos: 128,
  totalMorosos: 7,
};

const DashboardAdmin = ({ visitors = [], parking = [] }) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-2 text-slate-800">
        Panel Administrador
      </h1>
      <p className="text-slate-500 mb-8">
        Resumen general y control de la copropiedad
      </p>
      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-10">
        <div className="rounded-2xl shadow-sm p-6 flex flex-col items-center bg-indigo-50 border border-indigo-100">
          <span className="text-3xl font-semibold text-indigo-700">
            {mockResumen.totalAptos}
          </span>
          <span className="text-sm mt-2 text-slate-500">
            Unidad residencials
          </span>
        </div>
        <div className="rounded-2xl shadow-sm p-6 flex flex-col items-center bg-green-50 border border-green-100">
          <span className="text-3xl font-semibold text-green-700">
            {mockResumen.totalVisitantes}
          </span>
          <span className="text-sm mt-2 text-slate-500">Visitantes hoy</span>
        </div>
        <div className="rounded-2xl shadow-sm p-6 flex flex-col items-center bg-blue-50 border border-blue-100">
          <span className="text-3xl font-semibold text-blue-700">
            {mockResumen.totalVehiculos}
          </span>
          <span className="text-sm mt-2 text-slate-500">
            Vehículos parqueados
          </span>
        </div>
        <div className="rounded-2xl shadow-sm p-6 flex flex-col items-center bg-yellow-50 border border-yellow-100">
          <span className="text-3xl font-semibold text-yellow-700">
            ${mockResumen.totalRecaudo.toLocaleString()}
          </span>
          <span className="text-sm mt-2 text-slate-500">
            Recaudo parqueadero
          </span>
        </div>
        <div className="rounded-2xl shadow-sm p-6 flex flex-col items-center bg-red-50 border border-red-100">
          <span className="text-3xl font-semibold text-red-700">
            {mockResumen.totalMorosos}
          </span>
          <span className="text-sm mt-2 text-slate-500">Aptos morosos</span>
        </div>
      </div>
      {/* Guardias */}
      <div className="bg-white/80 rounded-2xl shadow p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-slate-700">
          Guardias y turnos
        </h2>
        <ul className="space-y-2 text-slate-600 text-sm">
          {mockGuardias.map((g, i) => (
            <li key={i} className={g.activo ? "font-bold text-green-700" : ""}>
              {g.nombre} - Turno: {g.turno}{" "}
              {g.activo && (
                <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                  Activo
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* Tabla de visitantes */}
      <div className="bg-white/80 rounded-2xl shadow p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-slate-700">
          Visitantes registrados
        </h2>
        <VisitorTable visitors={visitors} adminView={true} />
      </div>
      {/* Tabla de parqueadero */}
      <div className="bg-white/80 rounded-2xl shadow p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-slate-700">
          Vehículos en parqueadero
        </h2>
        <ParkingTable parking={parking} adminView={true} />
      </div>
      {/* Resumen de dinero por Unidad residencial */}
      <div className="bg-white/80 rounded-2xl shadow p-8">
        <h2 className="text-xl font-semibold mb-4 text-slate-700">
          Estado de cuentas por Unidad residencial
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Unidad residencial
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Propietario
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Saldo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {mockAptos.map((a, i) => (
              <tr key={i}>
                <td className="px-4 py-2">{a.apto}</td>
                <td className="px-4 py-2">{a.propietario}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    a.saldo > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  ${a.saldo.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardAdmin;
