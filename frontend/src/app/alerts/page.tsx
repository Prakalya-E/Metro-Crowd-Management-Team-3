import AlertPage from "@/components/operations/alert/alertpage";
import OperationsPageShell from "@/components/operations/OperationsPageShell";

export default function AlertsRoute() {
  return (
    <OperationsPageShell
      title="Alerts"
      description="Review and action live operational alerts"
    >
      <AlertPage />
    </OperationsPageShell>
  );
}