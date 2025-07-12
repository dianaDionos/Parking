import Dashboard from "../components/Dashboard";
import PanelGuardia from "../components/PanelGuardia";
import ParkingTable from "../components/ParkingTable";
import VisitorTable from "../components/VisitorTable";
import VisitorModal from "../components/VisitorModal";
import SearchBar from "../components/SearchBar";
import { FaParking, FaUserFriends, FaPlusCircle } from "react-icons/fa";
import React, { useState } from "react";
import parkingService from "../services/parkingService";
import FacturaVisual from "../components/FacturaVisual";
import ReciboSalida from "../components/ReciboSalida";
import TicketVisual from "../components/TicketVisual";
import DashboardAdmin from "../components/DashboardAdmin";
import GuardShiftModal from "../components/GuardShiftModal";

export default function DemoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [parking, setParking] = useState([]);
  const [printData, setPrintData] = useState(null);
  const [guardShiftModalOpen, setGuardShiftModalOpen] = useState(false);
  const [guardShiftLate, setGuardShiftLate] = useState(false);
  const [guardShiftPrevNotOut, setGuardShiftPrevNotOut] = useState(false);
  const [guardShifts, setGuardShifts] = useState([]);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [paqueteriaModalOpen, setPaqueteriaModalOpen] = useState(false);
  const [paqueteria, setPaqueteria] = useState([]);

  // Cargar parqueadero real
  const loadParking = () => {
    setParking(parkingService.getVehicles());
  };

  // Agregar visitante (usa ParkingService si tiene vehículo)
  const handleAddVisitor = async (visitorData) => {
    setVisitors((prev) => [...prev, visitorData]);
    if (visitorData.hasVehicle) {
      const ticket = await parkingService.generateTicket(visitorData, {
        plate: visitorData.plate,
        vehicleType: visitorData.vehicleType === "Carro" ? "car" : "moto",
      });
      loadParking();
      setPrintData({ type: "ticket", data: ticket });
    }
    setModalOpen(false);
  };

  // Registrar salida desde Visitantes
  const handleVisitorExit = async (visitor, idx) => {
    const now = new Date().toISOString();
    if (!visitor.hasVehicle) {
      setVisitors((prev) =>
        prev.map((v, i) =>
          i === idx ? { ...v, status: "salido", salida: now } : v
        )
      );
      setPrintData({ type: "salida", data: { ...visitor, salida: now } });
    } else {
      // Buscar vehículo en parkingService
      const veh = parkingService
        .getVehicles()
        .find((v) => v.licensePlate === visitor.plate);
      if (veh) {
        const billing = await parkingService.processExit(veh.id, {
          lostTicket: false,
          billingType: "personal",
          observations: "",
        });
        loadParking();
        setPrintData({ type: "factura", data: billing });
      }
      setVisitors((prev) =>
        prev.map((v, i) =>
          i === idx ? { ...v, status: "salido", salida: now } : v
        )
      );
    }
  };

  // Registrar salida desde Parqueadero
  const handleParkingExit = async (vehiculo) => {
    const idx = visitors.findIndex((v) => v.plate === vehiculo.licensePlate);
    if (idx !== -1) {
      await handleVisitorExit(visitors[idx], idx);
    }
  };

  // Reimprimir ticket/factura
  const handleReprint = (visitor) => {
    if (!visitor.hasVehicle) {
      setPrintData({ type: "salida", data: visitor });
    } else if (visitor.status === "salido") {
      // Buscar última factura
      const ticket = parkingService
        .getTickets()
        .find((t) => t.licensePlate === visitor.plate);
      if (ticket && ticket.billing) {
        setPrintData({ type: "factura", data: ticket.billing });
      }
    } else {
      setPrintData({ type: "ticket", data: visitor });
    }
  };

  // Cargar parqueadero al inicio y cuando cambie
  React.useEffect(() => {
    loadParking();
  }, []);

  // Simulación: abrir modal automáticamente a las 6:00, 14:00, 22:00 (turnos)
  React.useEffect(() => {
    const checkShiftTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      // Simula turnos a las 6:00, 14:00, 22:00
      if ((hour === 6 || hour === 14 || hour === 22) && minute < 5) {
        setGuardShiftModalOpen(true);
        // Simula lógica de llegada tarde y relevo no salido
        setGuardShiftLate(minute > 0); // Si no es en punto, es tarde
        setGuardShiftPrevNotOut(Math.random() < 0.3); // 30% chance de relevo no salido
      }
    };
    const interval = setInterval(checkShiftTime, 60000); // cada minuto
    checkShiftTime();
    return () => clearInterval(interval);
  }, []);

  const handleRegisterGuardShift = (data) => {
    setGuardShifts((prev) => [
      ...prev,
      { ...data, date: new Date().toISOString() },
    ]);
    setGuardShiftModalOpen(false);
  };

  const handleOpenExitModal = (visitor) => {
    setSelectedVisitor(visitor);
    setExitModalOpen(true);
  };

  const handleRegisterExit = (salidaData) => {
    setExitModalOpen(false);
    setSelectedVisitor(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Encabezado y acciones */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Panel Administrador
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Control rápido de Guardias visitantes y parqueaderos
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch gap-2 w-full md:w-auto"></div>
      </div>

      {/* PANEL ADMINISTRADOR DIOSNOS */}
      <div className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-10">
          <div className="rounded-2xl shadow border border-blue-100 p-6 flex flex-col items-center bg-white/80 text-blue-700">
            <FaUserFriends className="text-2xl mb-2 text-blue-300" />
            <span className="text-3xl font-normal">128</span>
            <span className="text-sm mt-2 text-slate-500">
              Unidad residencials
            </span>
          </div>
          <div className="rounded-2xl shadow border border-green-100 p-6 flex flex-col items-center bg-white/80 text-green-700">
            <FaUserFriends className="text-2xl mb-2 text-green-300" />
            <span className="text-3xl font-normal">34</span>
            <span className="text-sm mt-2 text-slate-500">Visitantes hoy</span>
          </div>
          <div className="rounded-2xl shadow border border-indigo-100 p-6 flex flex-col items-center bg-white/80 text-indigo-700">
            <FaParking className="text-2xl mb-2 text-indigo-300" />
            <span className="text-3xl font-normal">18</span>
            <span className="text-sm mt-2 text-slate-500">
              Vehículos parqueados
            </span>
          </div>
          <div className="rounded-2xl shadow border border-yellow-100 p-6 flex flex-col items-center bg-white/80 text-yellow-700">
            <FaPlusCircle className="text-2xl mb-2 text-yellow-300" />
            <span className="text-3xl font-normal">$250.000</span>
            <span className="text-sm mt-2 text-slate-500">
              Recaudo parqueadero
            </span>
          </div>
          <div className="rounded-2xl shadow border border-red-100 p-6 flex flex-col items-center bg-white/80 text-red-700">
            <FaParking className="text-2xl mb-2 text-red-300" />
            <span className="text-3xl font-normal">7</span>
            <span className="text-sm mt-2 text-slate-500">Aptos morosos</span>
          </div>
        </div>
        <div className="bg-white/80 rounded-2xl shadow p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">
            Guardias y turnos
          </h2>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li className="font-bold text-green-700">
              Juan Pérez - Turno: Mañana{" "}
              <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                Activo
              </span>
            </li>
            <li>Ana Torres - Turno: Tarde</li>
            <li>Luis Ríos - Turno: Noche</li>
          </ul>
        </div>
        {/* Solo visualización admin, no repetir tablas */}
        <div className="bg-white/80 rounded-2xl shadow p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">
            Visitantes registrados
          </h2>
          <VisitorTable visitors={visitors} adminView={true} />
        </div>
        <div className="bg-white/80 rounded-2xl shadow p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">
            Vehículos en parqueadero
          </h2>
          <ParkingTable parking={parking} adminView={true} />
        </div>
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
              <tr>
                <td className="px-4 py-2">302B</td>
                <td className="px-4 py-2">Laura Ramírez</td>
                <td className="px-4 py-2 font-semibold text-red-600">
                  $120.000
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">104A</td>
                <td className="px-4 py-2">Carlos Gómez</td>
                <td className="px-4 py-2 font-semibold text-green-600">$0</td>
              </tr>
              <tr>
                <td className="px-4 py-2">405C</td>
                <td className="px-4 py-2">Sandra Martínez</td>
                <td className="px-4 py-2 font-semibold text-red-600">
                  $50.000
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel de registro rápido */}
      <div className="rounded-2xl bg-white shadow p-4 border border-slate-100">
        <PanelGuardia
          onNuevoRegistro={() => setModalOpen(true)}
          onSalida={() => {}}
        />
      </div>
      <div className="flex justify-end mb-4">
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4 py-2 shadow transition font-semibold"
          onClick={() => setGuardShiftModalOpen(true)}
        >
          Registrar entrada de guardia
        </button>
      </div>

      {/* Modal de registro de turno de guardia */}
      <GuardShiftModal
        isOpen={guardShiftModalOpen}
        onClose={() => setGuardShiftModalOpen(false)}
        onRegister={handleRegisterGuardShift}
        late={guardShiftLate}
        previousNotOut={guardShiftPrevNotOut}
      />
      {/* Modal de visitante */}
      <VisitorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddVisitor={handleAddVisitor}
      />
      {/* Modal de impresión (ticket/factura/salida) */}
      {printData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-700"
              onClick={() => setPrintData(null)}
            >
              ×
            </button>
            {printData.type === "ticket" && (
              <div>
                <h3 className="text-lg font-bold mb-2 text-indigo-700">
                  Ticket de Entrada
                </h3>
                <TicketVisual ticket={printData.data} />
              </div>
            )}
            {printData.type === "factura" && (
              <div>
                <h3 className="text-lg font-bold mb-2 text-green-700">
                  Factura/Recibo de Salida
                </h3>
                <FacturaVisual billing={printData.data} />
              </div>
            )}
            {printData.type === "salida" && (
              <div>
                <h3 className="text-lg font-bold mb-2 text-slate-700">
                  Salida registrada
                </h3>
                <ReciboSalida visitor={printData.data} />
              </div>
            )}
            <button
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
              onClick={() => window.print()}
            >
              Reimprimir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
