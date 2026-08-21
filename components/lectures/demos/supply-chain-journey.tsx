"use client";

import Image from "next/image";
import { useState } from "react";
import { RotateCcw, ShieldAlert, ShieldCheck, Zap } from "lucide-react";

const EVENTS = [
	{ stage: "Manufacturer", participant: "PharmaCorp Bengaluru", time: "09:00 AM", quantity: 100, lot: "LOT-BLR-884", temp: "4.2°C", status: "Batch PCM-001 created & sealed" },
	{ stage: "Distributor", participant: "South Zone Logistics", time: "11:30 AM", quantity: 100, lot: "LOT-BLR-884", temp: "4.8°C", status: "Custody accepted & GPS tracked" },
	{ stage: "Warehouse", participant: "Cold Storage Zone 4", time: "03:10 PM", quantity: 100, lot: "LOT-BLR-884", temp: "5.1°C", status: "Cold-chain telemetry verified" },
	{ stage: "Hospital", participant: "Kristu Health Centre", time: "06:45 PM", quantity: 100, lot: "LOT-BLR-884", temp: "4.9°C", status: "Delivery verified & inspected" },
	{ stage: "Patient", participant: "Dispensing Desk", time: "07:15 PM", quantity: 1, lot: "LOT-BLR-884", temp: "Room Temp", status: "1 Strip dispensed to patient" },
] as const;

export default function SupplyChainJourney() {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [tampered, setTampered] = useState(false);
	const event = EVENTS[selectedIndex];
	const displayedQuantity = tampered && selectedIndex === 1 ? 1000 : event.quantity;

	return (
		<div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center">
			<div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
				{/* Visual Media & Stage Navigation */}
				<section className={`relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 ${
					tampered ? "border-rose-500/80 shadow-[0_0_60px_rgba(244,63,94,0.15)]" : "border-emerald-400/40 shadow-xl"
				}`} aria-label="Medicine supply-chain visual journey">
					<Image
						src="/images/lectures/medicine-supply-chain.webp"
						alt="A medicine batch moving from a manufacturer through transport and cold storage to a hospital and dispensing point"
						fill
						sizes="(min-width: 1024px) 55vw, 100vw"
						className="object-cover"
					/>
					<div className={`absolute inset-0 transition-all duration-300 ${
						tampered ? "bg-rose-950/60" : "bg-gradient-to-t from-black/95 via-black/30 to-black/40"
					}`} />

					{/* Top Header Overlay */}
					<div className="relative z-10 flex items-center justify-between gap-3 p-4">
						<span className="rounded-full border border-white/20 bg-black/70 px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-white backdrop-blur-md">
							Batch PCM-001 · Live Custody Provenance
						</span>
						<span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs font-bold uppercase backdrop-blur-md ${
							tampered ? "border-rose-400/70 bg-rose-950/80 text-rose-300" : "border-emerald-400/70 bg-emerald-950/80 text-emerald-300"
						}`} role={tampered ? "alert" : "status"}>
							{tampered ? <ShieldAlert className="size-4" /> : <ShieldCheck className="size-4" />}
							{tampered ? "INTEGRITY FAILED ✗" : "CRYPTOGRAPHICALLY VERIFIED ✓"}
						</span>
					</div>

					{/* Bottom Stage Progress Selector */}
					<div className="relative z-10 m-3 grid grid-cols-5 overflow-hidden rounded-2xl border border-white/15 bg-black/85 backdrop-blur-md">
						{EVENTS.map((item, index) => {
							const isSelected = selectedIndex === index;
							const isPast = index < selectedIndex;
							return (
								<button
									key={item.stage}
									type="button"
									onClick={() => setSelectedIndex(index)}
									className={`min-h-16 border-r border-white/10 p-2 text-center transition last:border-r-0 ${
										isSelected
											? "bg-amber-400 text-zinc-950 font-bold"
											: isPast
												? "bg-emerald-500/15 text-emerald-300"
												: "text-zinc-400 hover:bg-white/10 hover:text-white"
									}`}>
									<span className="block font-mono text-[9px] uppercase">0{index + 1}</span>
									<span className="mt-1 block truncate text-xs font-semibold">{item.stage}</span>
								</button>
							);
						})}
					</div>
				</section>

				{/* Event Detail & Verification Console */}
				<section className={`flex flex-col justify-between rounded-3xl border p-6 backdrop-blur-md transition-all duration-300 ${
					tampered ? "border-rose-500/60 bg-rose-950/30" : "border-white/15 bg-white/[0.035]"
				}`} aria-live="polite">
					<div>
						<div className="flex items-center justify-between border-b border-white/10 pb-3">
							<p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
								Node #{selectedIndex + 1} of {EVENTS.length} · Custody Check
							</p>
							<span className="font-mono text-xs text-zinc-400">{event.time}</span>
						</div>

						<h3 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">{event.stage}</h3>
						<p className="mt-1 text-sm font-semibold text-zinc-300">{event.participant}</p>

						<dl className="mt-4 grid grid-cols-3 gap-2.5">
							<div className="rounded-2xl border border-white/10 bg-black/40 p-3 text-center">
								<dt className="font-mono text-[9px] uppercase text-zinc-500">Lot ID</dt>
								<dd className="mt-1 font-mono text-xs font-bold text-amber-200">{event.lot}</dd>
							</div>
							<div className="rounded-2xl border border-white/10 bg-black/40 p-3 text-center">
								<dt className="font-mono text-[9px] uppercase text-zinc-500">Cold Temp</dt>
								<dd className="mt-1 font-mono text-xs font-bold text-emerald-300">{event.temp}</dd>
							</div>
							<div className="rounded-2xl border border-white/10 bg-black/40 p-3 text-center">
								<dt className="font-mono text-[9px] uppercase text-zinc-500">Batch Qty</dt>
								<dd className={`mt-1 font-mono text-xs font-bold ${tampered && selectedIndex === 1 ? "text-rose-400 font-extrabold" : "text-white"}`}>
									{displayedQuantity}
								</dd>
							</div>
						</dl>

						<div className={`mt-4 rounded-2xl border p-3.5 text-xs leading-relaxed ${
							tampered
								? "border-rose-500/50 bg-rose-950/40 text-rose-200 font-medium"
								: "border-emerald-500/30 bg-emerald-950/20 text-emerald-200"
						}`}>
							{tampered ? (
								<p>❌ <strong>Tamper detected at distributor handoff:</strong> Quantity secretly altered from 100 to 1,000. Downstream nodes reject the shipment because the manufacturer root digital signature is invalid.</p>
							) : (
								<p>✓ <strong>Reverse Trace Provenance:</strong> A patient at Node 05 can scan the packet QR code and verify the manufacturer factory signature and continuous cold-chain log all the way back to 09:00 AM.</p>
							)}
						</div>
					</div>

					<div className="mt-6 flex flex-wrap items-center gap-2">
						<button
							type="button"
							onClick={() => { setSelectedIndex(1); setTampered(true); }}
							disabled={tampered}
							className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-rose-600 px-5 text-xs font-bold text-white transition hover:bg-rose-500 disabled:opacity-40 shadow-lg shadow-rose-950/50">
							<Zap className="size-3.5" /> ⚡ Tamper Distributor Quantity
						</button>
						<button
							type="button"
							onClick={() => { setTampered(false); setSelectedIndex(0); }}
							className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 text-xs font-semibold text-zinc-200 transition hover:border-emerald-400 hover:text-emerald-300">
							<RotateCcw className="size-3.5" /> Restore Journey
						</button>
					</div>
				</section>
			</div>
		</div>
	);
}
