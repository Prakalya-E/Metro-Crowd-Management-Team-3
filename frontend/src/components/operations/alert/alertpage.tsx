"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BellRing, CheckCircle2, Clock3, Filter, TrainFront } from "lucide-react";

type AlertLevel = "Critical" | "Warning" | "Info";

const alerts: Array<{ id: number; title: string; station: string; detail: string; time: string; level: AlertLevel }> = [
  { id: 1, title: "Critical crowd density", station: "Rajiv Chowk", detail: "Platform 2 occupancy has reached 96%. Dispatch support staff.", time: "2 min ago", level: "Critical" },
  { id: 2, title: "Service delay", station: "Kashmere Gate", detail: "Yellow Line 142 is delayed by 5 minutes following a signal check.", time: "12 min ago", level: "Warning" },
  { id: 3, title: "Crowd level restored", station: "Noida Sector 18", detail: "Passenger density is back within the comfortable operating range.", time: "18 min ago", level: "Info" },
  { id: 4, title: "Platform dwell watch", station: "Central Secretariat", detail: "Monitor interchange flow during the next three arrivals.", time: "27 min ago", level: "Warning" },
];

const styles: Record<AlertLevel, string> = {
  Critical: "bg-red-500/10 text-red-500",
  Warning: "bg-orange-500/10 text-orange-500",
  Info: "bg-emerald-500/10 text-emerald-500",
};

export default function AlertPage() {
  const [filter, setFilter] = useState<AlertLevel | "All">("All");
  const [acknowledged, setAcknowledged] = useState<number[]>([]);
  const visibleAlerts = useMemo(
    () => alerts.filter((alert) => filter === "All" || alert.level === filter),
    [filter],
  );

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-border bg-card p-5 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Operations centre</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Live alert management</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Prioritize crowd, service, and safety events before they affect passenger journeys.</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold">
          <BellRing className="text-primary" size={20} />
          {alerts.length - acknowledged.length} active alerts
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={AlertTriangle} label="Critical" value="1" tone="text-red-500" />
        <Metric icon={Clock3} label="Needs review" value="2" tone="text-orange-500" />
        <Metric icon={CheckCircle2} label="Resolved today" value="18" tone="text-emerald-500" />
        <Metric icon={TrainFront} label="Service events" value="4" tone="text-primary" />
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-black">Alert feed</h2>
            <p className="mt-1 text-sm text-muted">Updates from stations and train-control systems.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={17} className="text-muted" />
            {(["All", "Critical", "Warning", "Info"] as const).map((item) => (
              <button key={item} onClick={() => setFilter(item)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${filter === item ? "bg-primary text-white" : "border border-border bg-background text-muted hover:border-primary"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {visibleAlerts.map((alert) => {
            const isAcknowledged = acknowledged.includes(alert.id);
            return (
              <article key={alert.id} className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles[alert.level]}`}><AlertTriangle size={20} /></div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><h3 className="font-black">{alert.title}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${styles[alert.level]}`}>{alert.level}</span></div>
                    <p className="mt-1 text-sm font-semibold text-primary">{alert.station}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{alert.detail}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 self-end md:self-auto">
                  <span className="text-xs font-semibold text-muted">{alert.time}</span>
                  <button disabled={isAcknowledged} onClick={() => setAcknowledged((items) => [...items, alert.id])} className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold transition hover:border-primary disabled:cursor-default disabled:border-emerald-500/30 disabled:text-emerald-500">
                    {isAcknowledged ? "Acknowledged" : "Acknowledge"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof AlertTriangle; label: string; value: string; tone: string }) {
  return <article className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between"><span className="text-sm font-bold text-muted">{label}</span><Icon className={tone} size={20} /></div><strong className="mt-4 block text-3xl">{value}</strong></article>;
}
