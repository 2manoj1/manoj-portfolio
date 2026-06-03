import {
	Activity,
	Cloud,
	Cpu,
	Database,
	Gauge,
	ServerCog,
	ShieldCheck,
} from "lucide-react";
import { getSandboxMetrics } from "@/lib/lab-metrics";
import { cn } from "@/lib/utils";

export async function SandboxDashboard() {
	const snapshot = await getSandboxMetrics();

	return (
		<div className="min-w-0 border border-border bg-card/10">
			<div className="grid min-w-0 gap-0 lg:grid-cols-[0.9fr_1.1fr]">
				<div className="min-w-0 border-b border-border p-5 md:p-6 lg:border-b-0 lg:border-r">
					<div className="flex items-center gap-2">
						<ServerCog className="size-4 text-amber" />
						<p className="font-mono text-xs uppercase tracking-wide text-foreground">
							Local Sandbox
						</p>
					</div>
					<h3 className="mt-4 text-2xl font-medium text-foreground">
						Apple Silicon telemetry hook.
					</h3>
					<p className="mt-3 break-words text-sm leading-6 text-muted-foreground">
						Live-ready metrics for models, memory, tunnel health, and local
						AI infrastructure.
					</p>

					<div className="mt-6 grid min-w-0 grid-cols-2 gap-3">
						<MetricTile
							icon={Activity}
							label="Source"
							value={snapshot.source === "live" ? "Live" : "Snapshot"}
						/>
						<MetricTile icon={ShieldCheck} label="Health" value={snapshot.health} />
						<MetricTile icon={Cloud} label="Tunnel" value="Cloudflare" />
						<MetricTile icon={Database} label="Stores" value="Postgres / Redis / Qdrant" />
					</div>
				</div>

				<div className="min-w-0 p-5 md:p-6">
					<div className="grid gap-3 md:grid-cols-3">
						{snapshot.models.map((model) => (
							<article key={model.name} className="min-w-0 border border-border bg-background/45 p-4">
								<div className="flex items-center justify-between gap-3">
									<Cpu className="size-4 text-amber" />
									<span
										className={cn(
											"rounded-md border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide",
											model.status === "online" &&
												"border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
											model.status === "testing" &&
												"border-amber/30 bg-amber/10 text-amber",
											model.status === "standby" &&
												"border-border bg-card/20 text-muted-foreground"
										)}>
										{model.status}
									</span>
								</div>
								<h4 className="mt-4 text-base font-medium text-foreground">
									{model.name}
								</h4>
								<p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
									{model.runtime}
								</p>
								<div className="mt-4 space-y-3 border-t border-border pt-4">
									<div>
										<p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
											Generation
										</p>
										<p className="mt-1 break-words text-sm text-foreground">
											{model.tokensPerSecond}
										</p>
									</div>
									<div>
										<p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
											Memory
										</p>
										<p className="mt-1 break-words text-sm text-foreground">{model.memory}</p>
									</div>
								</div>
							</article>
						))}
					</div>

					<div className="mt-5 grid gap-3 md:grid-cols-2">
						{snapshot.metrics.map((metric) => (
							<div key={metric.label} className="min-w-0 border border-border bg-background/45 p-4">
								<p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
									{metric.label}
								</p>
								<p className="mt-2 break-words text-sm font-medium text-foreground">
									{metric.value}
								</p>
								<p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
									{metric.detail}
								</p>
							</div>
						))}
					</div>

					<div className="mt-5 min-w-0 border border-border bg-background/45 p-4">
						<div className="flex items-center gap-2">
							<Gauge className="size-4 text-amber" />
							<p className="font-mono text-xs uppercase tracking-wide text-foreground">
								Tunnel Log
							</p>
						</div>
						<div className="mt-4 space-y-3">
							{snapshot.tunnelLogs.map((log) => (
								<div key={`${log.time}-${log.event}`} className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-3 text-xs">
									<p className="font-mono text-muted-foreground">{log.time}</p>
									<p
										className={cn(
											"break-words leading-5",
											log.status === "ok" ? "text-foreground" : "text-amber"
										)}>
										{log.event}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function MetricTile({
	icon: Icon,
	label,
	value,
}: {
	icon: typeof Activity;
	label: string;
	value: string;
}) {
	return (
		<div className="min-w-0 border border-border bg-background/45 p-3">
			<Icon className="size-4 text-amber" />
			<p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
				{label}
			</p>
			<p className="mt-1 break-words text-sm font-medium leading-5 text-foreground">{value}</p>
		</div>
	);
}
