"use client";

import { useState } from "react";
import { Calculator, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdvisoryEstimator() {
	const [requests, setRequests] = useState(50000);
	const [inputTokens, setInputTokens] = useState(2000);
	const [outputTokens, setOutputTokens] = useState(800);
	const [strategy, setStrategy] = useState<"commercial" | "lightweight" | "hybrid">("hybrid");

	// Calculations
	const totalTokens = requests * (inputTokens + outputTokens);
	const millionsOfTokens = totalTokens / 1000000;

	// Pricing assumptions
	const pricing = {
		commercial: { input: 2.5, output: 10.0 }, // Claude 3.5 Sonnet / GPT-4o style
		lightweight: { input: 0.15, output: 0.6 }, // GPT-4o mini / Claude Haiku style
	};

	let totalCost = 0;
	let savings = 0;

	const standardCommercialCost = 
		(requests * inputTokens * pricing.commercial.input / 1000000) +
		(requests * outputTokens * pricing.commercial.output / 1000000);

	if (strategy === "commercial") {
		totalCost = standardCommercialCost;
	} else if (strategy === "lightweight") {
		totalCost = 
			(requests * inputTokens * pricing.lightweight.input / 1000000) +
			(requests * outputTokens * pricing.lightweight.output / 1000000);
		savings = standardCommercialCost - totalCost;
	} else {
		// Hybrid Local Routing (Manoj's Home Lab Tunnel)
		// Assumption: 80% queries routed to local SLM (Ollama running Qwen-14B / Llama-3.2) at $0 cost.
		// 20% routed to Commercial API for complex reasoning.
		const commercialCount = requests * 0.2;

		const localInferenceCost = 0;
		const commercialInferenceCost = 
			(commercialCount * inputTokens * pricing.commercial.input / 1000000) +
			(commercialCount * outputTokens * pricing.commercial.output / 1000000);

		totalCost = localInferenceCost + commercialInferenceCost;
		savings = standardCommercialCost - totalCost;
	}

	// Latency estimates
	const getLatencyEstimate = () => {
		if (strategy === "commercial") return "1.2s - 2.5s (Sync API call)";
		if (strategy === "lightweight") return "400ms - 800ms (Low-latency)";
		return "~120ms (Local routing) / 2.0s (Cloud fallback)";
	};

	const formatCurrency = (val: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 0,
		}).format(val);
	};

	return (
		<div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] border border-border rounded-xl bg-card/25 p-6 md:p-8 overflow-hidden">
			<div className="space-y-6">
				<div>
					<h3 className="text-xl font-medium text-foreground flex items-center gap-2">
						<Calculator className="size-5 text-amber" />
						AI System Token & Cost Estimator
					</h3>
					<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
						Slide parameters to project API overhead and visualize cost savings from a custom hybrid local-routing architecture.
					</p>
				</div>

				{/* Sliders */}
				<div className="space-y-5">
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs font-mono">
							<span className="text-muted-foreground uppercase">Expected Monthly Queries</span>
							<span className="text-foreground font-semibold">{requests.toLocaleString()}</span>
						</div>
						<input
							type="range"
							min="1000"
							max="500000"
							step="1000"
							value={requests}
							onChange={(e) => setRequests(Number(e.target.value))}
							className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-amber"
						/>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs font-mono">
							<span className="text-muted-foreground uppercase">Average Input Tokens / Query</span>
							<span className="text-foreground font-semibold">{inputTokens.toLocaleString()} tokens</span>
						</div>
						<input
							type="range"
							min="200"
							max="16000"
							step="200"
							value={inputTokens}
							onChange={(e) => setInputTokens(Number(e.target.value))}
							className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-amber"
						/>
						<p className="text-[10px] text-muted-foreground/60 leading-none">Typical prompt: ~1,500 tokens context + instructions</p>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs font-mono">
							<span className="text-muted-foreground uppercase">Average Output Tokens / Query</span>
							<span className="text-foreground font-semibold">{outputTokens.toLocaleString()} tokens</span>
						</div>
						<input
							type="range"
							min="50"
							max="4000"
							step="50"
							value={outputTokens}
							onChange={(e) => setOutputTokens(Number(e.target.value))}
							className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-amber"
						/>
						<p className="text-[10px] text-muted-foreground/60 leading-none">Typical agent output: ~400 to 1,000 reasoning tokens</p>
					</div>
				</div>

				{/* Strategy Tabs */}
				<div className="space-y-3 pt-2">
					<span className="text-xs font-mono uppercase text-muted-foreground">Inference Routing Strategy</span>
					<div className="grid gap-2 grid-cols-3">
						{(["commercial", "lightweight", "hybrid"] as const).map((strat) => (
							<button
								key={strat}
								type="button"
								onClick={() => setStrategy(strat)}
								className={cn(
									"rounded-lg border px-3 py-2.5 text-xs font-mono font-medium text-center transition-all duration-200",
									strategy === strat
										? "border-amber/80 bg-amber/8 text-amber shadow-sm"
										: "border-border bg-background/40 text-muted-foreground hover:border-muted-foreground/30 hover:bg-background"
								)}
							>
								{strat === "commercial" && "Full Commercial"}
								{strat === "lightweight" && "Lightweight API"}
								{strat === "hybrid" && "Hybrid Local"}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Results Display Panel */}
			<div className="flex flex-col rounded-xl border border-border/80 bg-zinc-950/20 p-5 md:p-6 justify-between">
				<div className="space-y-6">
					<div className="border-b border-border pb-4">
						<span className="font-mono text-[10px] text-amber uppercase tracking-widest">Projection Output</span>
						<h4 className="mt-1 text-base font-medium text-foreground">Monthly Operational Cost</h4>
					</div>

					<div className="space-y-4">
						<div>
							<span className="text-xs text-muted-foreground">Monthly Total Volume</span>
							<p className="text-xl font-semibold text-foreground font-mono mt-0.5">
								{millionsOfTokens.toFixed(1)}M <span className="text-sm font-normal text-muted-foreground">tokens</span>
							</p>
						</div>

						<div>
							<span className="text-xs text-muted-foreground">Projected Cost / Month</span>
							<p className="text-3xl font-bold text-foreground font-mono mt-0.5 text-amber">
								{formatCurrency(totalCost)}
							</p>
						</div>

						{strategy === "hybrid" && (
							<div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-3 text-xs leading-relaxed text-emerald-400">
								<div className="flex items-center gap-1.5 font-bold uppercase tracking-wider mb-1">
									<ShieldCheck className="size-4 shrink-0" />
									Local Architecture Benefit
								</div>
								By routing 80% of low-complexity agent steps to local models on your Apple Silicon hardware via Cloudflare Tunnels, you save **{formatCurrency(savings)} / month** compared to standard Commercial APIs.
							</div>
						)}

						{strategy === "lightweight" && (
							<div className="rounded-lg bg-secondary/35 border border-border px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
								<div className="flex items-center gap-1.5 font-semibold text-foreground mb-1 uppercase">
									<Zap className="size-4 shrink-0" />
									Standard Optimization
								</div>
								Saves **{formatCurrency(savings)} / month**, but lacks deep reasoning capacity of top models or zero-cost private execution features.
							</div>
						)}
					</div>
				</div>

				<div className="mt-6 pt-5 border-t border-border space-y-4">
					<div className="flex justify-between items-center text-xs">
						<span className="text-muted-foreground font-mono">Inference Latency</span>
						<span className="text-foreground font-semibold font-mono">{getLatencyEstimate()}</span>
					</div>
					<div className="flex justify-between items-center text-xs">
						<span className="text-muted-foreground font-mono">Infrastructure Security</span>
						<span className="text-foreground font-semibold font-mono">
							{strategy === "hybrid" ? "Private (Egress tunnel)" : "Third-Party Cloud"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
