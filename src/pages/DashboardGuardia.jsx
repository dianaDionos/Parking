import PanelGuardia from "../components/PanelGuardia";
import ParkingTable from "../components/ParkingTable";
import VisitorTable from "../components/VisitorTable";
import VisitorModal from "../components/VisitorModal";
import PaqueteriaTable from "../components/PackageTable";
import PaqueteriaModal from "../components/PaqueteriaModal";
import ExitModal from "../components/ExitModal";
import {
  FaParking,
  FaUserFriends,
  FaBoxOpen,
  FaSmile,
  FaQuestionCircle,
} from "react-icons/fa";
import React, { useState } from "react";
import parkingService from "../services/parkingService";
import FacturaVisual from "../components/FacturaVisual";
import ReciboSalida from "../components/ReciboSalida";
import TicketVisual from "../components/TicketVisual";


const mockVisitors = [
  {
    name: "Pedro López",
    phone: "3123456789",
    id: "12345678",
    email: "pedro@email.com",
    hasVehicle: true,
    plate: "ABC-111",
    vehicleType: "Carro",
    resident: { name: "Laura Ramírez", apartment: "302B", interior: "Torre 2" },
    date: "2025-07-11 10:15",
    status: "ingresado",
  },
  {
    name: "María Ruiz",
    phone: "3119876543",
    id: "87654321",
    email: "maria@email.com",
    hasVehicle: false,
    plate: "",
    vehicleType: "",
    resident: { name: "Carlos Gómez", apartment: "104A", interior: "Torre 1" },
    date: "2025-07-11 11:05",
    status: "ingresado",
  },
];

const parkingDataPrueba = [
  {
    id: 1,
    status: "ocupado",
    type: "car",
    licensePlate: "ABC-111",
    visitorName: "Pedro López",
    apartment: "302B",
    interior: "Torre 2",
    entryTime: new Date("2025-07-11T10:15:00"),
    spot: 1,
  },
  {
    id: 2,
    status: "ocupado",
    type: "moto",
    licensePlate: "XYZ-222",
    visitorName: "Laura Ramírez",
    apartment: "104A",
    interior: "Torre 1",
    entryTime: new Date("2025-07-11T09:15:00"),
    spot: 2,
  },
];

export default function DemoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [visitors, setVisitors] = useState(mockVisitors);
  const [parking, setParking] = useState(parkingDataPrueba);
  const [printData, setPrintData] = useState(null);
  const [paqueteriaModalOpen, setPaqueteriaModalOpen] = useState(false);
  const [paqueteria, setPaqueteria] = useState([
    {
      nombre: "Laura Ramírez",
      apto: "302B",
      interior: "Torre 2",
      paquetes: [
        {
          remitente: "Amazon",
          descripcion: "Caja mediana",
          fecha: "2025-07-11T10:00:00",
        },
        {
          remitente: "Servientrega",
          descripcion: "Sobre documento",
          fecha: "2025-07-11T10:05:00",
        },
      ],
      entregado: false,
    },
    {
      nombre: "Carlos Gómez",
      apto: "104A",
      interior: "Torre 1",
      paquetes: [
        {
          remitente: "Falabella",
          descripcion: "Bolsa pequeña",
          fecha: "2025-07-11T09:30:00",
        },
      ],
      entregado: false,
    },
  ]);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [exitData, setExitData] = useState(null);
  const celadorName = "Carlos"; 

  const [showHelp, setShowHelp] = useState(false);

  const loadParking = () => {
    setParking(parkingService.getVehicles());
  };

  const handleAddVisitor = async (visitorData) => {
    setVisitors((prev) => [...prev, visitorData]);
    if (visitorData.hasVehicle) {
      const ticket = await parkingService.generateTicket(visitorData, {
        plate: visitorData.plate,
        vehicleType: visitorData.vehicleType === "Carro" ? "car" : "moto",
      });
      setParking((prev) => [...prev, ticket]);
      setPrintData({ type: "ticket", data: ticket });
    }
    setModalOpen(false);
  };

  const handleVisitorExit = (visitor, idx) => {
    setExitData({ ...visitor, idx, source: "visitor" });
    setExitModalOpen(true);
  };

  const handleParkingExit = (vehicle) => {
    setExitData({ ...vehicle, source: "parking" });
    setExitModalOpen(true);
  };

  const handleExitConfirm = (registro, facturaData = null) => {
    if (registro.source === "visitor") {
      // Actualiza visitante
      setVisitors((prev) =>
        prev.map((v, i) =>
          i === registro.idx
            ? { ...v, status: "salido", salida: new Date().toISOString() }
            : v
        )
      );
      if (registro.hasVehicle && registro.plate) {
        setParking((prev) =>
          prev.filter((p) => p.licensePlate !== registro.plate)
        );
      }
      if (facturaData) setPrintData({ type: "factura", data: facturaData });
      else setPrintData({ type: "salida", data: registro });
    } else if (registro.source === "parking") {
      setParking((prev) => prev.filter((p) => p.id !== registro.id));
      setVisitors((prev) =>
        prev.map((v) =>
          v.plate === registro.licensePlate
            ? { ...v, status: "salido", salida: new Date().toISOString() }
            : v
        )
      );
      if (facturaData) setPrintData({ type: "factura", data: facturaData });
      else setPrintData({ type: "salida", data: registro });
    }
    setExitModalOpen(false);
  };

  const handleReprint = (visitor) => {
    if (!visitor.hasVehicle) {
      setPrintData({ type: "salida", data: visitor });
    } else if (visitor.status === "salido") {
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

  // Registrar llegada de paquetería
  const handleRegisterPaqueteria = (data) => {
    setPaqueteria((prev) => [...prev, { ...data, entregado: false }]);
    setPaqueteriaModalOpen(false);
  };

  const handleEntregar = (registro) => {
    setPaqueteria((prev) =>
      prev.map((p) => (p === registro ? { ...p, entregado: true } : p))
    );
  };

  // Cargar parqueadero al inicio y cuando cambie
  React.useEffect(() => {
    loadParking();
  }, []);

  // Hora actual para el saludo
  const [hora, setHora] = useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-screen-xl mx-auto relative">
      {/* Saludo y ayuda visual */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <FaSmile className="text-4xl text-blue-400" aria-label="Bienvenida" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              ¡Hola, {celadorName}!
            </h1>
            <p className="text-sm text-slate-500">
              {hora.toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              — Bienvenido al panel de control. Gestiona visitantes,
              parqueaderos y paquetería de forma rápida y sencilla.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowHelp(true)}
          className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Ayuda rápida"
        >
          <FaQuestionCircle />
          Ayuda rápida
        </button>
      </header>

      {/* Tips visuales */}
      <section
        className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-4 text-blue-700 text-sm"
        aria-live="polite"
      >
        <FaQuestionCircle className="text-lg" />
        <span>
          Usa la barra de búsqueda en cada módulo para encontrar información
          rápidamente. Navega con <b>Tab</b> y accede a acciones con{" "}
          <b>Enter</b> o <b>Espacio</b>.
        </span>
      </section>

      {/* Resumen de módulos */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 flex flex-col items-center shadow-sm">
          <FaUserFriends className="text-3xl text-blue-400 mb-2" />
          <span className="text-2xl font-bold text-blue-700">
            {visitors.length}
          </span>
          <span className="text-sm text-blue-700">Visitantes</span>
        </div>
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5 flex flex-col items-center shadow-sm">
          <FaParking className="text-3xl text-green-400 mb-2" />
          <span className="text-2xl font-bold text-green-700">
            {parking.length}
          </span>
          <span className="text-sm text-green-700">Parqueaderos ocupados</span>
        </div>
        <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-5 flex flex-col items-center shadow-sm">
          <FaBoxOpen className="text-3xl text-yellow-400 mb-2" />
          <span className="text-2xl font-bold text-yellow-700">
            {paqueteria.length}
          </span>
          <span className="text-sm text-yellow-700">Paquetes pendientes</span>
        </div>
      </section>

      {/* Panel de registro rápido */}
      <section className="rounded-2xl bg-white shadow p-4 border border-slate-100">
        <PanelGuardia
          onNuevoRegistro={() => setModalOpen(true)}
          onNotificarPaqueteria={() => setPaqueteriaModalOpen(true)}
        />
      </section>

      {/* Tabla Visitantes */}
      <section
        className="rounded-2xl bg-white shadow border border-blue-100 p-0 overflow-hidden"
        aria-label="Tabla de visitantes"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-md font-semibold flex items-center gap-2 text-blue-700">
            <FaUserFriends className="text-blue-400" /> Visitantes
          </h2>
          <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
            {visitors.length} visitantes
          </span>
        </div>
        <div className="p-4 pt-0">
          <VisitorTable
            visitors={visitors}
            setVisitors={setVisitors}
            onExit={handleVisitorExit}
            onReprint={handleReprint}
          />
        </div>
      </section>

      {/* Tabla Parqueadero */}
      <section
        className="rounded-2xl bg-white shadow border border-green-100 p-0 overflow-hidden"
        aria-label="Tabla de parqueadero"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-md font-semibold flex items-center gap-2 text-green-700">
            <FaParking className="text-green-400" /> Parqueadero
          </h2>
          <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-100">
            {parking.length} parqueaderos
          </span>
        </div>
        <div className="p-4 pt-0">
          <ParkingTable parking={parking} onExit={handleParkingExit} />
        </div>
      </section>

      {/* Tabla Paquetería */}
      <section
        className="rounded-2xl bg-white shadow border border-yellow-100 p-0 overflow-hidden"
        aria-label="Tabla de paquetería"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-md font-semibold flex items-center gap-2 text-yellow-700">
            <FaBoxOpen className="text-yellow-400" /> Paquetería pendiente
          </h2>
          <span className="bg-yellow-50 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full border border-yellow-100">
            {paqueteria.length} paquetes
          </span>
        </div>
        <div className="p-4 pt-0">
          <PaqueteriaTable
            paqueteria={paqueteria}
            onEntregar={handleEntregar}
          />
        </div>
      </section>

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
      {/* Modal de confirmación de salida */}
      {exitModalOpen && exitData && (
        <ExitModal
          isOpen={exitModalOpen}
          onClose={() => setExitModalOpen(false)}
          parkingData={exitData}
          onExitConfirm={handleExitConfirm}
        />
      )}
      <PaqueteriaModal
        isOpen={paqueteriaModalOpen}
        onClose={() => setPaqueteriaModalOpen(false)}
        onRegister={handleRegisterPaqueteria}
      />
      {/* Modal de ayuda rápida */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-700"
              onClick={() => setShowHelp(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2 text-blue-700 flex items-center gap-2">
              <FaQuestionCircle /> Ayuda rápida
            </h3>
            <ul className="list-disc pl-5 text-slate-700 space-y-2 text-sm">
              <li>
                Para registrar un visitante, haz clic en <b>Nuevo visitante</b>.
              </li>
              <li>
                Para registrar la salida, usa el botón <b>Salida</b> en la
                tabla.
              </li>
              <li>
                Busca por nombre, placa o apartamento en la barra superior de
                cada módulo.
              </li>
              <li>¿Dudas? Contacta al administrador o revisa el manual.</li>
            </ul>
          </div>
        </div>
      )}
      {/* Bot mascot en la esquina inferior derecha */}
      <img
        src=""
        alt="Bot asistente"
        className="fixed bottom-4 right-4 w-24 h-24 z-50 drop-shadow-xl"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
