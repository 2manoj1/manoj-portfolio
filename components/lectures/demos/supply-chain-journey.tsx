"use client";

import Image from "next/image";
import { useState } from "react";
import { RotateCcw, ShieldAlert, ShieldCheck } from "lucide-react";

const EVENTS = [
	{ stage: "Manufacturer", participant: "Bengaluru Pharma", time: "09:00", quantity: 100, status: "Batch PCM-001 created" },
	{ stage: "Distributor", participant: "South Zone Distribution", time: "11:30", quantity: 100, status: "Custody accepted" },
	{ stage: "Warehouse", participant: "ColdChain BLR-04", time: "15:10", quantity: 100, status: "Temperature verified" },
	{ stage: "Hospital", participant: "City Care Hospital", time: "18:45", quantity: 100, status: "Delivery verified" },
	{ stage: "Patient", participant: "Dispensing desk", time: "19:15", quantity: 1, status: "Unit dispensed" },
] as const;

export default function SupplyChainJourney() {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [tampered, setTampered] = useState(false);
	const event = EVENTS[selectedIndex];
	const displayedQuantity = tampered && selectedIndex === 1 ? 1000 : event.quantity;

	return (
		<div className="mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-[1.05fr_0.95fr]">
			<section className={`relative min-h-80 overflow-hidden rounded-3xl border transition ${tampered ? "border-rose-400/60 shadow-[0_0_60px_rgba(251,113,133,0.08)]" : "border-emerald-400/35"}`} aria-label="Medicine supply-chain visual journey">
				<Image src="/images/lectures/medicine-supply-chain.webp" alt="A medicine batch moving from a manufacturer through transport and cold storage to a hospital and dispensing point" fill sizes="(min-width: 1024px) 54vw, 100vw" className="object-cover" />
				<div className={`absolute inset-0 transition ${tampered ? "bg-rose-950/35" : "bg-gradient-to-t from-black/90 via-black/5 to-black/20"}`} />
				<div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
					<span className="rounded-full border border-white/15 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur">Batch PCM-001 · live custody map</span>
					<span className={`inline-flex items-center gap-2 rounded-full border bg-black/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider backdrop-blur ${tampered ? "border-rose-400/50 text-rose-200" : "border-emerald-400/40 text-emerald-200"}`} role={tampered ? "alert" : "status"}>{tampered ? <ShieldAlert className="size-4" /> : <ShieldCheck className="size-4" />}{tampered ? "Integrity failed" : "Verified"}</span>
				</div>
				<div className="absolute inset-x-3 bottom-3 grid grid-cols-5 overflow-hidden rounded-2xl border border-white/15 bg-black/75 backdrop-blur-md" role="tablist" aria-label="Medicine journey stages">
					{EVENTS.map((item, index) => <button key={item.stage} type="button" role="tab" aria-selected={selectedIndex === index} onClick={() => setSelectedIndex(index)} className={`min-h-14 border-r border-white/10 px-2 text-center transition last:border-r-0 ${selectedIndex === index ? "bg-amber-300 text-zinc-950" : index < selectedIndex ? "bg-emerald-400/[0.08] text-emerald-200" : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"}`}><span className="block font-mono text-[9px] uppercase">0{index + 1}</span><span className="mt-1 block truncate text-[10px] font-semibold sm:text-xs">{item.stage}</span></button>)}
				</div>
			</section>

			<section className={`flex min-h-80 flex-col rounded-3xl border p-5 md:p-6 ${tampered ? "border-rose-400/50 bg-rose-400/[0.06]" : "border-white/15 bg-white/[0.035]"}`} aria-live="polite">
				<div className="flex items-center justify-between gap-4"><p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">Event console · {selectedIndex + 1} / {EVENTS.length}</p><span className="font-mono text-xs text-zinc-500">21 Aug 2026 · {event.time}</span></div>
				<h3 className="mt-4 font-display text-4xl text-white">{event.stage}</h3>
				<p className="mt-2 text-sm text-zinc-400">{event.participant}</p>
				<dl className="mt-5 grid grid-cols-2 gap-3">
					<div className="rounded-2xl border border-white/10 bg-black/20 p-4"><dt className="font-mono text-[10px] uppercase text-zinc-500">Quantity</dt><dd className={`mt-1 text-3xl ${tampered && selectedIndex === 1 ? "text-rose-300" : "text-white"}`}>{displayedQuantity}</dd></div>
					<div className="rounded-2xl border border-white/10 bg-black/20 p-4"><dt className="font-mono text-[10px] uppercase text-zinc-500">Recorded status</dt><dd className="mt-2 text-sm leading-5 text-zinc-200">{event.status}</dd></div>
				</dl>
				<div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${tampered ? "border-rose-400/35 bg-rose-400/[0.06] text-rose-100" : "border-cyan-400/25 bg-cyan-400/[0.04] text-zinc-300"}`}>{tampered ? "Quantity changed from 100 to 1,000. The visual journey remains, but its cryptographic trust no longer does." : "Every handoff is independently recorded and can be verified against the same batch history."}</div>
				<div className="mt-auto flex flex-wrap gap-2 pt-4">
					<button type="button" onClick={() => { setSelectedIndex(1); setTampered(true); }} disabled={tampered} className="min-h-11 rounded-xl bg-rose-700 px-4 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-40">Tamper distributor quantity</button>
					<button type="button" onClick={() => { setTampered(false); setSelectedIndex(0); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm text-zinc-200"><RotateCcw className="size-4" /> Restore journey</button>
				</div>
			</section>
		</div>
	);
}
