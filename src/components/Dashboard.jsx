import React from "react";

const stats = [
  { label: "Residentes", value: 128, color: "bg-indigo-100 text-indigo-700" },
  { label: "Visitantes hoy", value: 34, color: "bg-green-100 text-green-700" },
  { label: "Vehículos parqueados", value: 18, color: "bg-blue-100 text-blue-700" },
  { label: "Alertas de seguridad", value: 2, color: "bg-red-100 text-red-700" },
];

const Dashboard = () => (
  <div className="max-w-6xl mx-auto">
    <h1 className="text-3xl font-bold mb-2 text-slate-800">Bienvenido a Dionos</h1>
    <p className="text-slate-500 mb-8">Panel general de tu propiedad horizontal</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl shadow-sm p-6 flex flex-col items-center ${stat.color} transition-all`}
        >
          <span className="text-3xl font-bold">{stat.value}</span>
          <span className="text-sm mt-2">{stat.label}</span>
        </div>
      ))}
    </div>
    <div className="bg-white/80 rounded-2xl shadow p-8">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">Resumen de actividad</h2>
      <ul className="space-y-2 text-slate-600 text-sm">
        <li>• 5 visitantes registrados en la última hora</li>
        <li>• 2 vehículos salieron del parqueadero</li>
        <li>• No hay entregas pendientes</li>
        <li>• Última alerta de seguridad: hace 3 horas</li>
      </ul>
    </div>
  </div>
);

export default Dashboard;