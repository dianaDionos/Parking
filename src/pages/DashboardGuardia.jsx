import PanelGuardia from '../components/PanelGuardia';

export default function GuardiaPage() {
  return (
    <PanelGuardia
      onNuevoRegistro={() => alert("Registrar nuevo visitante")}
      onSalida={() => alert("Registrar salida")}
    />
  );
}