import StationPage from "@/components/operations/station/stationpage";
import OperationsPageShell from "@/components/operations/OperationsPageShell";

export default function StationRoute() {
  return (
    <OperationsPageShell
      title="Stations"
      description="Station capacity, facilities, and operations overview"
    >
      <StationPage />
    </OperationsPageShell>
  );
}
