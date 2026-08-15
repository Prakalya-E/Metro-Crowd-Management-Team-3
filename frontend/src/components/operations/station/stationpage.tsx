"use client";

import { useMemo, useState } from "react";
import { MapPin, Search, ShieldCheck, Users } from "lucide-react";
import StationOccupancyChart from "@/components/dashboard/StationOccupancyChart";

const stations = [
  { name: "Rajiv Chowk", line: "Blue · Yellow", occupancy: 96, status: "High", gates: "12 / 14 open" },
  { name: "Kashmere Gate", line: "Red · Yellow · Violet", occupancy: 84, status: "Moderate", gates: "18 / 18 open" },
  { name: "Central Secretariat", line: "Yellow · Violet", occupancy: 68, status: "Comfortable", gates: "8 / 10 open" },
  { name: "Noida Sector 18", line: "Blue", occupancy: 58, status: "Comfortable", gates: "6 / 8 open" },
  { name: "Botanical Garden", line: "Blue · Magenta", occupancy: 74, status: "Moderate", gates: "10 / 12 open" },
  { name: "Dwarka", line: "Blue", occupancy: 38, status: "Comfortable", gates: "7 / 8 open" },
];

const statusClass: Record<string, string> = { High: "bg-red-500/10 text-red-500", Moderate: "bg-orange-500/10 text-orange-500", Comfortable: "bg-emerald-500/10 text-emerald-500" };

export default function StationPage() {
  const [search, setSearch] = useState("");
  const visibleStations = useMemo(() => stations.filter((station) => `${station.name} ${station.line}`.toLowerCase().includes(search.toLowerCase())), [search]);
  return <div className="space-y-6">
    <section className="flex flex-col justify-between gap-5 rounded-2xl border border-border bg-card p-5 lg:flex-row lg:items-center"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Station operations</p><h1 className="mt-2 text-3xl font-black tracking-tight">Station network</h1><p className="mt-2 text-sm leading-6 text-muted">Review capacity, access points, and current operating status across the network.</p></div><div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold"><ShieldCheck className="text-primary" size={19} />All safety systems online</div></section>
    <section className="grid gap-4 md:grid-cols-3"><Card icon={MapPin} label="Monitored stations" value="143" /><Card icon={Users} label="Average occupancy" value="67%" /><Card icon={ShieldCheck} label="Stations within limit" value="142" /></section>
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><div className="rounded-2xl border border-border bg-card p-5"><div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-xl font-black">Station directory</h2><p className="mt-1 text-sm text-muted">Live operational snapshot.</p></div><div className="relative"><Search className="absolute left-3 top-3 text-muted" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search station" className="h-11 rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary" /></div></div><div className="space-y-3">{visibleStations.map((station) => <article key={station.name} className="rounded-xl border border-border bg-background p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h3 className="font-black">{station.name}</h3><p className="mt-1 text-sm text-muted">{station.line} · {station.gates}</p></div><div className="flex items-center gap-3"><div className="w-24"><div className="h-2 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-primary" style={{ width: `${station.occupancy}%` }} /></div><p className="mt-1 text-right text-xs font-bold">{station.occupancy}%</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[station.status]}`}>{station.status}</span></div></div></article>)}{visibleStations.length === 0 && <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">No stations match your search.</p>}</div></div><StationOccupancyChart /></section>
  </div>;
}

function Card({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) { return <article className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between"><span className="text-sm font-bold text-muted">{label}</span><Icon className="text-primary" size={20} /></div><strong className="mt-4 block text-3xl">{value}</strong></article>; }
