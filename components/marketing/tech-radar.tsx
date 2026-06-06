"use client";

import { useState, useRef, useEffect } from "react";
import { 
	Radio, 
	Compass, 
	Search, 
	AlertTriangle, 
	ShieldCheck, 
	ZoomIn, 
	ZoomOut, 
	Maximize2, 
	X, 
	RefreshCw, 
	Grid,
	Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { radarItems, radarQuadrants, radarRings, type RadarItem } from "@/content/radar";

export function TechRadar() {
	const [activeItem, setActiveItem] = useState<RadarItem>(radarItems[0]);
	const [hoveredItem, setHoveredItem] = useState<RadarItem | null>(null);
	const [activeQuadrant, setActiveQuadrant] = useState<keyof typeof radarQuadrants | "All">("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [zoom, setZoom] = useState(1.0);
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [groupBy, setGroupBy] = useState<"ring" | "quadrant">("ring");

	// Spotlight Hover states
	const [hoveredRing, setHoveredRing] = useState<string | null>(null);
	const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null);
	const [selectedLegendRing, setSelectedLegendRing] = useState<string | "All">("All");

	const [isDragging, setIsDragging] = useState(false);
	const svgRef = useRef<SVGSVGElement>(null);
	const dragStartRef = useRef({ x: 0, y: 0 });
	const hasMovedRef = useRef(false);
	const initialPinchDistRef = useRef(0);
	const initialZoomRef = useRef(1.0);
	const inspectorRef = useRef<HTMLDivElement>(null);

	const cx = 200;
	const cy = 200;

	// ESC key to close fullscreen
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isFullscreen) {
				setIsFullscreen(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isFullscreen]);

	// Lock body scroll when fullscreen is active
	useEffect(() => {
		if (isFullscreen) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
		return () => {
			document.body.classList.remove("overflow-hidden");
		};
	}, [isFullscreen]);

	// Convert polar coordinates to cartesian relative to SVG center (200, 200)
	const getCoordinates = (radius: number, angle: number) => {
		const angleInRad = ((angle - 90) * Math.PI) / 180; // offset by 90 to align 0 to the top
		const x = cx + radius * Math.cos(angleInRad);
		const y = cy + radius * Math.sin(angleInRad);
		return { x, y };
	};

	// Mouse Drag Handlers for Panning
	const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
		dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
		setIsDragging(true);
		hasMovedRef.current = false;
	};

	const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
		if (isDragging) {
			const dx = e.clientX - dragStartRef.current.x;
			const dy = e.clientY - dragStartRef.current.y;
			if (Math.hypot(dx - pan.x, dy - pan.y) > 2) {
				hasMovedRef.current = true;
			}
			setPan({ x: dx, y: dy });
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	// Touch Event Handlers for Mobile Panning and Pinch Zooming
	const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
		if (e.touches.length === 1) {
			const touch = e.touches[0];
			dragStartRef.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
			setIsDragging(true);
			hasMovedRef.current = false;
		} else if (e.touches.length === 2) {
			setIsDragging(false);
			const t1 = e.touches[0];
			const t2 = e.touches[1];
			initialPinchDistRef.current = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
			initialZoomRef.current = zoom;
		}
	};

	const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
		if (e.touches.length === 1 && isDragging) {
			const touch = e.touches[0];
			setPan({
				x: touch.clientX - dragStartRef.current.x,
				y: touch.clientY - dragStartRef.current.y
			});
			hasMovedRef.current = true;
		} else if (e.touches.length === 2 && initialPinchDistRef.current > 0) {
			const t1 = e.touches[0];
			const t2 = e.touches[1];
			const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
			const factor = dist / initialPinchDistRef.current;
			setZoom(Math.max(0.6, Math.min(3.0, initialZoomRef.current * factor)));
		}
	};

	const handleTouchEnd = () => {
		setIsDragging(false);
		initialPinchDistRef.current = 0;
	};

	// Mouse Wheel zoom handler
	const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
		e.preventDefault();
		const factor = e.deltaY * -0.0015;
		setZoom(prev => Math.max(0.6, Math.min(3.0, prev + factor)));
	};

	// Focus targets for specific quadrants
	const handleFocusQuadrant = (quadrantKey: keyof typeof radarQuadrants | "All") => {
		setActiveQuadrant(quadrantKey);
		if (quadrantKey === "All") {
			setZoom(1.0);
			setPan({ x: 0, y: 0 });
		} else {
			setZoom(1.6);
			// Translate coordinates to center the specified quadrant on the 400x400 view
			const centers = {
				Orchestration: { x: -80, y: 80 }, // Top-Right -> Shift left and down
				Models: { x: -80, y: -80 },       // Bottom-Right -> Shift left and up
				Data: { x: 80, y: -80 },           // Bottom-Left -> Shift right and up
				Platform: { x: 80, y: 80 }         // Top-Left -> Shift right and down
			};
			setPan(centers[quadrantKey]);
		}
	};

	const handleZoomIn = () => setZoom(prev => Math.min(3.0, prev + 0.2));
	const handleZoomOut = () => setZoom(prev => Math.max(0.6, prev - 0.2));
	const handleZoomReset = () => {
		setZoom(1.0);
		setPan({ x: 0, y: 0 });
		setActiveQuadrant("All");
		setSelectedLegendRing("All");
	};

	// Directory item click handler
	const handleSelectItem = (item: RadarItem) => {
		setActiveItem(item);
		
		// Automatically pan and center the selected node's quadrant slightly
		setZoom(1.4);
		const centers = {
			Orchestration: { x: -50, y: 50 },
			Models: { x: -50, y: -50 },
			Data: { x: 50, y: -50 },
			Platform: { x: 50, y: 50 }
		};
		setPan(centers[item.quadrant]);

		// Smooth scroll to inspector card on desktop/mobile
		setTimeout(() => {
			inspectorRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}, 100);
	};

	// Calculate if point is filtered out (spotlight dimming)
	const isPointFiltered = (item: RadarItem) => {
		if (activeQuadrant !== "All" && item.quadrant !== activeQuadrant) return true;
		if (searchQuery !== "" && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
		if (selectedLegendRing !== "All" && item.ring !== selectedLegendRing) return true;
		if (hoveredRing !== null && item.ring !== hoveredRing) return true;
		if (hoveredQuadrant !== null && item.quadrant !== hoveredQuadrant) return true;
		return false;
	};

	// Filter elements based on query and quadrant
	const filteredItems = radarItems.filter((item) => {
		const matchesQuadrant = activeQuadrant === "All" || item.quadrant === activeQuadrant;
		const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
			item.insight.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesQuadrant && matchesSearch;
	});

	// Dynamic stats
	const adoptCount = radarItems.filter(item => item.ring === "Adopt").length;
	const trialCount = radarItems.filter(item => item.ring === "Trial").length;
	const assessCount = radarItems.filter(item => item.ring === "Assess").length;
	const holdCount = radarItems.filter(item => item.ring === "Hold").length;

	const itemsByRing = {
		Adopt: radarItems.filter(item => item.ring === "Adopt"),
		Trial: radarItems.filter(item => item.ring === "Trial"),
		Assess: radarItems.filter(item => item.ring === "Assess"),
		Hold: radarItems.filter(item => item.ring === "Hold")
	};

	const itemsByQuadrant = {
		Orchestration: radarItems.filter(item => item.quadrant === "Orchestration"),
		Models: radarItems.filter(item => item.quadrant === "Models"),
		Data: radarItems.filter(item => item.quadrant === "Data"),
		Platform: radarItems.filter(item => item.quadrant === "Platform")
	};

	// Renders the SVG canvas grid
	const renderRadarSVG = (sizeClass: string) => {
		const activePreview = hoveredItem || activeItem;

		return (
			<div className={cn("relative w-full aspect-square border border-zinc-200 dark:border-border/80 bg-zinc-100/50 dark:bg-zinc-950/20 rounded-xl overflow-hidden shadow-inner select-none", sizeClass)}>
				
				{/* Style block for pure CSS animations (GPU-driven to prevent React re-render flickers) */}
				<svg className="hidden">
					<style>{`
						@keyframes radar-sweep {
							0% { transform: rotate(0deg); }
							100% { transform: rotate(360deg); }
						}
						.radar-scanner-sweep {
							transform-origin: 200px 200px;
							animation: radar-sweep 16s linear infinite;
						}
					`}</style>
				</svg>

				<svg 
					ref={svgRef}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					onWheel={handleWheel}
					className="w-full h-full cursor-grab active:cursor-grabbing block touch-none"
					viewBox="0 0 400 400"
				>
					{/* Zoomable & Pannable Wrapper Group */}
					<g 
						transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
						style={{ 
							transformOrigin: "200px 200px", 
							transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)" 
						}}
					>
						{/* Concentric rings */}
						{(Object.keys(radarRings) as Array<keyof typeof radarRings>).map((key) => {
							const r = radarRings[key].radius;
							return (
								<g key={key}>
									<circle
										cx={cx}
										cy={cy}
										r={r}
										className="fill-none stroke-zinc-300 dark:stroke-zinc-600/75 stroke-[1px]"
									/>
									<text
										x={cx + 3}
										y={cy - r + 10}
										className="fill-zinc-500 dark:fill-zinc-400 font-mono text-[8px] font-bold tracking-widest uppercase pointer-events-none"
									>
										{key}
									</text>
								</g>
							);
						})}

						{/* Grid polar crosshairs */}
						<line x1="200" y1="20" x2="200" y2="380" className="stroke-zinc-300 dark:stroke-zinc-500/50 stroke-[1px]" strokeDasharray="3 3" />
						<line x1="20" y1="200" x2="380" y2="200" className="stroke-zinc-300 dark:stroke-zinc-500/50 stroke-[1px]" strokeDasharray="3 3" />

						{/* Fine tick compass indexing around perimeter (r=180) */}
						{Array.from({ length: 36 }).map((_, i) => {
							const angle = i * 10;
							const rad = ((angle - 90) * Math.PI) / 180;
							const isMajor = angle % 90 === 0;
							const tickLen = isMajor ? 5 : 2.5;
							const x1 = cx + 180 * Math.cos(rad);
							const y1 = cy + 180 * Math.sin(rad);
							const x2 = cx + (180 - tickLen) * Math.cos(rad);
							const y2 = cy + (180 - tickLen) * Math.sin(rad);
							return (
								<line
									key={i}
									x1={x1}
									y1={y1}
									x2={x2}
									y2={y2}
									className="stroke-zinc-300 dark:stroke-zinc-400/50 stroke-[1px] pointer-events-none"
								/>
							);
						})}

						{/* Static Sweep wedge animated via CSS transforms */}
						<g className="radar-scanner-sweep pointer-events-none">
							<path 
								d="M 200 200 L 200 20 A 180 180 0 0 1 290 44 Z" 
								fill="rgba(245, 158, 11, 0.06)" 
							/>
							<line 
								x1="200" 
								y1="200" 
								x2="200" 
								y2="20" 
								stroke="rgba(245, 158, 11, 0.3)" 
								strokeWidth="1.2" 
							/>
						</g>

						{/* Quadrant Static Labels */}
						<text x="340" y="35" className="fill-zinc-500 dark:fill-zinc-400 font-mono text-[9px] font-extrabold tracking-widest uppercase text-right pointer-events-none">Orchestration</text>
						<text x="340" y="375" className="fill-zinc-500 dark:fill-zinc-400 font-mono text-[9px] font-extrabold tracking-widest uppercase text-right pointer-events-none">Models</text>
						<text x="60" y="375" className="fill-zinc-500 dark:fill-zinc-400 font-mono text-[9px] font-extrabold tracking-widest uppercase pointer-events-none">Data</text>
						<text x="60" y="35" className="fill-zinc-500 dark:fill-zinc-400 font-mono text-[9px] font-extrabold tracking-widest uppercase pointer-events-none">Platform</text>

						{/* Active Node Points mapping */}
						{filteredItems.map((item) => {
							const { x, y } = getCoordinates(item.radius, item.angle);
							const isSelected = item.id === activeItem.id;
							const isHovered = hoveredItem && item.id === hoveredItem.id;
							const isFiltered = isPointFiltered(item);

							const colors = {
								Adopt: "fill-emerald-400 stroke-emerald-500/40",
								Trial: "fill-amber stroke-amber/40",
								Assess: "fill-blue-400 stroke-blue-500/40",
								Hold: "fill-rose-400 stroke-rose-500/40"
							};
							const ringColor = colors[item.ring] || colors.Adopt;
							const opacity = isFiltered ? 0.08 : 1.0;

							return (
								<g 
									key={item.id}
									className={cn(isFiltered ? "pointer-events-none" : "cursor-pointer")}
									onClick={() => handleSelectItem(item)}
									onMouseEnter={() => setHoveredItem(item)}
									onMouseLeave={() => setHoveredItem(null)}
									opacity={opacity}
								>
									{/* Pulse overlay circle if selected */}
									{isSelected && (
										<circle
											cx={x}
											cy={y}
											r={8.5}
											className={cn(
												"fill-none stroke-[1.5px] opacity-100 animate-ping",
												item.ring === "Adopt" && "stroke-emerald-400/50",
												item.ring === "Trial" && "stroke-amber/50",
												item.ring === "Assess" && "stroke-blue-400/50",
												item.ring === "Hold" && "stroke-rose-400/50"
											)}
										/>
									)}
									{/* Glow backing */}
									<circle
										cx={x}
										cy={y}
										r={isHovered ? 12 : (isSelected ? 9 : 6.5)}
										className={cn(
											"transition-all duration-300 pointer-events-none",
											item.ring === "Adopt" && "fill-emerald-400/10",
											item.ring === "Trial" && "fill-amber/10",
											item.ring === "Assess" && "fill-blue-400/10",
											item.ring === "Hold" && "fill-rose-400/10",
											(isHovered || isSelected) && "opacity-100"
										)}
									/>
									{/* Center core point */}
									<circle
										cx={x}
										cy={y}
										r={isSelected ? 5 : 3.5}
										className={cn("transition-all duration-300 stroke-[3px]", ringColor)}
									/>
									{/* Floating Node Label */}
									{(isSelected || isHovered || searchQuery !== "") && (
										<text
											x={x + 7}
											y={y + 2.5}
											className={cn(
												"font-mono text-[8px] tracking-tight pointer-events-none font-medium fill-zinc-600 dark:fill-zinc-300",
												isSelected && "fill-amber font-bold",
												isHovered && "fill-zinc-900 dark:fill-white"
											)}
										>
											{item.name}
										</text>
									)}
								</g>
							);
						})}
					</g>
				</svg>

				{/* Stabilized Hover/Selected Preview Card (Fixed at the bottom of the SVG container to prevent overlaps) */}
				{activePreview && (
					<div className="absolute bottom-4 left-4 right-4 rounded-lg border border-zinc-200 dark:border-border bg-white/95 dark:bg-zinc-950/95 p-3.5 shadow-xl backdrop-blur-md font-mono text-[10px] flex justify-between items-center z-10 animate-in slide-in-from-bottom-2 duration-200">
						<div className="space-y-0.5 min-w-0 pr-3">
							<div className="flex items-center gap-2">
								<span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{activePreview.name}</span>
								<span className="text-[8px] text-muted-foreground/60 uppercase">[{activePreview.quadrant}]</span>
							</div>
							<p className="text-zinc-500 dark:text-zinc-400 text-[9px] truncate leading-normal">{activePreview.insight}</p>
						</div>
						<span className={cn(
							"rounded-md px-2 py-0.5 text-[8px] uppercase tracking-wide border shrink-0 font-medium",
							activePreview.ring === "Adopt" && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
							activePreview.ring === "Trial" && "bg-amber-50 dark:bg-amber/10 text-amber-800 dark:text-amber border-amber-200 dark:border-amber/20",
							activePreview.ring === "Assess" && "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
							activePreview.ring === "Hold" && "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
						)}>
							{activePreview.ring}
						</span>
					</div>
				)}

				{/* Interaction Help Label */}
				<div className="absolute top-3 right-3 pointer-events-none rounded bg-zinc-100/80 dark:bg-black/60 border border-zinc-200 dark:border-white/5 px-2 py-1 font-mono text-[7px] text-zinc-650 dark:text-muted-foreground uppercase tracking-wider">
					Drag to Pan | Scroll to Zoom
				</div>
			</div>
		);
	};

	// Renders the detailed ADR fields
	const renderADR = (item: RadarItem) => {
		return (
			<div className="space-y-4">
				{item.adr ? (
					<div className="space-y-3 font-mono text-xs">
						<div className="rounded-lg border border-zinc-200 dark:border-border bg-white dark:bg-zinc-950/45 p-3.5 space-y-1.5 min-w-0">
							<div className="flex items-center gap-1.5 text-amber-800 dark:text-amber text-[9px] font-bold uppercase tracking-widest">
								<AlertTriangle className="size-3 text-amber-800/80 dark:text-amber/80 shrink-0" />
								<span>[PROBLEM / CONTEXT]</span>
							</div>
							<p className="text-zinc-700 dark:text-zinc-300 leading-normal font-sans text-xs pl-4 border-l border-amber-300 dark:border-amber/30 break-words">
								{item.adr.problem}
							</p>
						</div>

						<div className="rounded-lg border border-zinc-200 dark:border-border bg-white dark:bg-zinc-950/45 p-3.5 space-y-1.5 min-w-0">
							<div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-widest">
								<ShieldCheck className="size-3 text-emerald-700/80 dark:text-emerald-400/80 shrink-0" />
								<span>[ARCHITECTURAL DECISION]</span>
							</div>
							<p className="text-zinc-700 dark:text-zinc-300 leading-normal font-sans text-xs pl-4 border-l border-emerald-300 dark:border-emerald-500/30 break-words">
								{item.adr.decision}
							</p>
						</div>

						<div className="rounded-lg border border-zinc-200 dark:border-border bg-white dark:bg-zinc-950/45 p-3.5 space-y-1.5 min-w-0">
							<div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 text-[9px] font-bold uppercase tracking-widest">
								<Info className="size-3 text-blue-700/80 dark:text-blue-400/80 shrink-0" />
								<span>[ENGINEERING TRADEOFFS]</span>
							</div>
							<p className="text-zinc-700 dark:text-zinc-300 leading-normal font-sans text-xs pl-4 border-l border-blue-300 dark:border-blue-500/30 break-words">
								{item.adr.tradeoff}
							</p>
						</div>
					</div>
				) : (
					<div className="rounded-lg border border-dashed border-zinc-200 dark:border-border/80 p-6 text-center text-xs font-mono text-muted-foreground/60 italic bg-zinc-100/50 dark:bg-secondary/5">
						No formal ADR is registered for this evaluation block. This node reflects minor experimental tests or deprecated tools.
					</div>
				)}
			</div>
		);
	};

	// Directory render groupings
	const renderDirectoryGroupings = () => {
		const datasets = (groupBy === "ring" ? itemsByRing : itemsByQuadrant) as Record<string, RadarItem[]>;
		const labelMapping = groupBy === "ring" 
			? (key: string) => `${key} Ring`
			: (key: string) => radarQuadrants[key as keyof typeof radarQuadrants].name;

		return Object.keys(datasets).map((groupKey) => {
			const groupItems = datasets[groupKey];
			if (groupItems.length === 0) return null;

			return (
				<div key={groupKey} className="space-y-2">
					<h5 
						onMouseEnter={() => {
							if (groupBy === "ring") setHoveredRing(groupKey);
							else setHoveredQuadrant(groupKey);
						}}
						onMouseLeave={() => {
							if (groupBy === "ring") setHoveredRing(null);
							else setHoveredQuadrant(null);
						}}
						className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1 mt-3 hover:text-foreground cursor-help"
					>
						{labelMapping(groupKey)} ({groupItems.length})
					</h5>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 min-w-0">
						{groupItems.map((item) => {
							const isSelected = item.id === activeItem.id;
							const ringDotColors = {
								Adopt: "bg-emerald-400",
								Trial: "bg-amber",
								Assess: "bg-blue-400",
								Hold: "bg-rose-400"
							}[item.ring];

							return (
								<button
									key={item.id}
									type="button"
									onClick={() => handleSelectItem(item)}
									className={cn(
										"flex items-center justify-between text-left font-mono text-[10px] rounded-lg px-2.5 py-1.5 transition-all truncate border min-w-0 w-full",
										isSelected 
											? "bg-amber-100/50 dark:bg-amber/10 border-amber-300 dark:border-amber/30 text-amber-800 dark:text-amber font-semibold"
											: "bg-zinc-100/50 dark:bg-secondary/20 border-zinc-200 dark:border-border/40 hover:bg-zinc-200/85 dark:hover:bg-secondary/40 text-zinc-700 dark:text-zinc-300"
									)}
								>
									<span className="truncate pr-2">{item.name}</span>
									<span className={cn("size-1.5 rounded-full shrink-0", ringDotColors)} />
								</button>
							);
						})}
					</div>
				</div>
			);
		});
	};

	return (
		<div className="space-y-8">
			{/* High-Impact Centered Radar Visual Workspace */}
			<div className="flex flex-col items-center justify-center border border-zinc-200 dark:border-border/80 bg-zinc-50 dark:bg-zinc-950/20 rounded-xl p-5 md:p-8 shadow-sm overflow-hidden min-w-0 w-full space-y-6">
				
				{/* Controls Toolbar: Stacked on mobile, side-by-side on desktop */}
				<div className="w-full flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center pb-4 border-b border-zinc-200 dark:border-border/60">
					{/* Search Input */}
					<div className="relative w-full md:max-w-[240px]">
						<Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
						<input
							type="text"
							placeholder="Search radar nodes..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full rounded-lg border border-zinc-200 dark:border-border bg-zinc-100/30 dark:bg-background/50 py-1.5 pl-9 pr-4 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-amber focus:outline-none"
						/>
					</div>
 
					{/* Pan/Zoom & Fullscreen tools */}
					<div className="flex items-center gap-2 justify-between md:justify-end">
						<div className="flex items-center border border-zinc-200 dark:border-border rounded-lg bg-zinc-100/30 dark:bg-background/40 p-0.5 overflow-hidden">
							<button
								type="button"
								onClick={handleZoomOut}
								title="Zoom Out"
								className="p-1.5 rounded hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all"
							>
								<ZoomOut className="size-3.5" />
							</button>
							<span className="px-2 font-mono text-[9px] text-muted-foreground min-w-[36px] text-center">
								{Math.round(zoom * 100)}%
							</span>
							<button
								type="button"
								onClick={handleZoomIn}
								title="Zoom In"
								className="p-1.5 rounded hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all"
							>
								<ZoomIn className="size-3.5" />
							</button>
							<button
								type="button"
								onClick={handleZoomReset}
								title="Reset View"
								className="p-1.5 border-l border-zinc-200 dark:border-border hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all"
							>
								<RefreshCw className="size-3" />
							</button>
						</div>
 
						<button
							type="button"
							onClick={() => setIsFullscreen(true)}
							title="Open Presentation Mode"
							className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-border bg-zinc-100/30 dark:bg-background/50 hover:bg-zinc-200/50 dark:hover:bg-secondary/80 text-xs font-mono text-muted-foreground hover:text-foreground px-3 py-1.5 transition-all"
						>
							<Maximize2 className="size-3.5" />
							<span className="hidden sm:inline">Presentation Hub</span>
						</button>
					</div>
				</div>
 
				{/* Focus target quick-buttons with hover spotlights */}
				<div className="w-full flex flex-wrap gap-1 justify-center">
					<button
						type="button"
						onClick={() => handleFocusQuadrant("All")}
						className={cn(
							"rounded px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider transition-all border font-semibold",
							activeQuadrant === "All"
								? "bg-amber-100/50 dark:bg-amber/15 border-amber-300 dark:border-amber/40 text-amber-800 dark:text-amber"
								: "bg-zinc-100/50 dark:bg-secondary/10 border-zinc-200 dark:border-border/20 text-muted-foreground hover:bg-zinc-200 dark:hover:bg-secondary hover:text-foreground"
						)}
					>
						Fit All
					</button>
					{(Object.keys(radarQuadrants) as Array<keyof typeof radarQuadrants>).map((key) => (
						<button
							key={key}
							type="button"
							onClick={() => handleFocusQuadrant(key)}
							onMouseEnter={() => setHoveredQuadrant(key)}
							onMouseLeave={() => setHoveredQuadrant(null)}
							className={cn(
								"rounded px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider transition-all border",
								activeQuadrant === key
									? "bg-amber-100/50 dark:bg-amber/15 border-amber-300 dark:border-amber/40 text-amber-800 dark:text-amber font-semibold"
									: "bg-zinc-100/50 dark:bg-secondary/10 border-zinc-200 dark:border-border/20 text-muted-foreground hover:bg-zinc-200 dark:hover:bg-secondary hover:text-foreground"
							)}
						>
							Focus: {radarQuadrants[key].name}
						</button>
					))}
				</div>
 
				{/* Massive Radar Center Stage SVG */}
				<div className="w-full flex justify-center py-4">
					{renderRadarSVG("max-w-[420px] sm:max-w-[480px] md:max-w-[560px]")}
				</div>
 
				{/* Volume statistics legends at the base of the radar with hover highlights & filtering */}
				<div className="w-full border-t border-zinc-200 dark:border-border/60 pt-5">
					<span className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest block text-center mb-3">
						Interactive Legend (Hover to Spotlight | Click to Filter)
					</span>
					<div className="grid gap-2 grid-cols-2 sm:grid-cols-4 select-none">
						<div 
							onClick={() => setSelectedLegendRing(selectedLegendRing === "Adopt" ? "All" : "Adopt")}
							onMouseEnter={() => setHoveredRing("Adopt")}
							onMouseLeave={() => setHoveredRing(null)}
							className={cn(
								"rounded-lg border p-3.5 text-center font-mono cursor-pointer transition-all",
								selectedLegendRing === "Adopt" 
									? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-400/85 dark:border-emerald-400/80 shadow-md shadow-emerald-500/5" 
									: "border-zinc-200 dark:border-border bg-zinc-100/40 dark:bg-zinc-950/40 hover:bg-zinc-200/50 dark:hover:bg-secondary/40",
								hoveredRing === "Adopt" && "border-emerald-500/60"
							)}
						>
							<span className="text-[8px] text-muted-foreground uppercase block font-semibold tracking-wide">Adopt</span>
							<p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">{adoptCount}</p>
						</div>

						<div 
							onClick={() => setSelectedLegendRing(selectedLegendRing === "Trial" ? "All" : "Trial")}
							onMouseEnter={() => setHoveredRing("Trial")}
							onMouseLeave={() => setHoveredRing(null)}
							className={cn(
								"rounded-lg border p-3.5 text-center font-mono cursor-pointer transition-all",
								selectedLegendRing === "Trial" 
									? "bg-amber-50 dark:bg-amber/10 border-amber-300 dark:border-amber/80 dark:border-amber/80 shadow-md shadow-amber/5" 
									: "border-zinc-200 dark:border-border bg-zinc-100/40 dark:bg-zinc-950/40 hover:bg-zinc-200/50 dark:hover:bg-secondary/40",
								hoveredRing === "Trial" && "border-amber/60"
							)}
						>
							<span className="text-[8px] text-muted-foreground uppercase block font-semibold tracking-wide">Trial</span>
							<p className="mt-1 text-lg font-bold text-amber-800 dark:text-amber">{trialCount}</p>
						</div>

						<div 
							onClick={() => setSelectedLegendRing(selectedLegendRing === "Assess" ? "All" : "Assess")}
							onMouseEnter={() => setHoveredRing("Assess")}
							onMouseLeave={() => setHoveredRing(null)}
							className={cn(
								"rounded-lg border p-3.5 text-center font-mono cursor-pointer transition-all",
								selectedLegendRing === "Assess" 
									? "bg-blue-50 dark:bg-blue-500/10 border-blue-400/85 dark:border-blue-400/80 shadow-md shadow-blue-500/5" 
									: "border-zinc-200 dark:border-border bg-zinc-100/40 dark:bg-zinc-950/40 hover:bg-zinc-200/50 dark:hover:bg-secondary/40",
								hoveredRing === "Assess" && "border-blue-500/60"
							)}
						>
							<span className="text-[8px] text-muted-foreground uppercase block font-semibold tracking-wide">Assess</span>
							<p className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400">{assessCount}</p>
						</div>

						<div 
							onClick={() => setSelectedLegendRing(selectedLegendRing === "Hold" ? "All" : "Hold")}
							onMouseEnter={() => setHoveredRing("Hold")}
							onMouseLeave={() => setHoveredRing(null)}
							className={cn(
								"rounded-lg border p-3.5 text-center font-mono cursor-pointer transition-all",
								selectedLegendRing === "Hold" 
									? "bg-rose-50 dark:bg-rose-500/10 border-rose-400/85 dark:border-rose-400/80 shadow-md shadow-rose-500/5" 
									: "border-zinc-200 dark:border-border bg-zinc-100/40 dark:bg-zinc-950/40 hover:bg-zinc-200/50 dark:hover:bg-secondary/40",
								hoveredRing === "Hold" && "border-rose-500/60"
							)}
						>
							<span className="text-[8px] text-muted-foreground uppercase block font-semibold tracking-wide">Hold</span>
							<p className="mt-1 text-lg font-bold text-rose-600 dark:text-rose-400">{holdCount}</p>
						</div>
					</div>
				</div>
			</div>
 
			{/* Second-Stage Panels (Directory on left, ADR Document on right) */}
			<div className="grid gap-6 grid-cols-1 lg:grid-cols-2 pt-4 border-t border-zinc-200 dark:border-border/40">
				
				{/* Pane A: Systems Directory Groupings */}
				<div className="border border-zinc-200 dark:border-border/80 bg-zinc-50 dark:bg-zinc-900/10 rounded-xl p-5 md:p-6 flex flex-col max-h-[560px] overflow-y-auto">
					<div className="flex items-center justify-between border-b border-zinc-200 dark:border-border/60 pb-3 mb-3 shrink-0">
						<div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-100">
							<Grid className="size-4 text-amber" />
							<span>Systems Directory</span>
						</div>
 
						<div className="flex border border-zinc-200 dark:border-border rounded p-0.5 bg-zinc-100/50 dark:bg-zinc-950/20">
							<button
								type="button"
								onClick={() => setGroupBy("ring")}
								className={cn(
									"px-2 py-0.5 rounded text-[8px] font-mono uppercase transition-all",
									groupBy === "ring" ? "bg-amber-100/50 dark:bg-amber/15 text-amber-800 dark:text-amber font-semibold" : "text-muted-foreground"
								)}
							>
								Ring
							</button>
							<button
								type="button"
								onClick={() => setGroupBy("quadrant")}
								className={cn(
									"px-2 py-0.5 rounded text-[8px] font-mono uppercase transition-all ml-1",
									groupBy === "quadrant" ? "bg-amber-100/50 dark:bg-amber/15 text-amber-800 dark:text-amber font-semibold" : "text-muted-foreground"
								)}
							>
								Quadrant
							</button>
						</div>
					</div>
 
					<div className="space-y-4 overflow-y-auto pr-1">
						{renderDirectoryGroupings()}
					</div>
				</div>
 
				{/* Pane B: ADR Inspector Technical Document */}
				<div 
					ref={inspectorRef}
					className="border border-zinc-200 dark:border-border/80 bg-zinc-50 dark:bg-zinc-900/10 rounded-xl p-5 md:p-6 space-y-4 max-h-[560px] overflow-y-auto scroll-mt-20"
				>
					<div className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-border/60 pb-3 shrink-0">
						<Radio className="size-4 text-amber animate-pulse shrink-0" />
						<span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-100">
							ADR Technical Document
						</span>
					</div>

					<div className="space-y-4">
						<div>
							<div className="flex items-center justify-between">
								<span className="font-mono text-[10px] text-amber-800/80 dark:text-amber/80 uppercase tracking-widest">
									{radarQuadrants[activeItem.quadrant].name}
								</span>
								<span className={cn(
									"rounded px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-wide border shrink-0",
									activeItem.ring === "Adopt" && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
									activeItem.ring === "Trial" && "bg-amber-50 dark:bg-amber/10 text-amber-800 dark:text-amber border-amber-200 dark:border-amber/20",
									activeItem.ring === "Assess" && "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
									activeItem.ring === "Hold" && "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
								)}>
									{activeItem.verdict}
								</span>
							</div>
							<h4 className="mt-1 text-xl font-normal text-zinc-900 dark:text-zinc-100 truncate">
								{activeItem.name}
							</h4>
						</div>

						{/* System Insight */}
						<div className="rounded-lg border border-zinc-200 dark:border-border bg-white dark:bg-secondary/15 p-4 font-mono text-xs leading-relaxed break-words">
							<span className="text-muted-foreground/60 block uppercase font-bold tracking-wider mb-1">&gt; System Insight:</span>
							<p className="text-zinc-700 dark:text-zinc-300 leading-normal font-sans text-xs">{activeItem.insight}</p>
						</div>
 
						{/* Detailed ADR breakdown */}
						{renderADR(activeItem)}
					</div>
				</div>
 
			</div>

			{/* Fullscreen Presentation Hub overlay */}
			{isFullscreen && (
				<div className="fixed inset-0 z-50 bg-zinc-50/98 dark:bg-zinc-950/98 backdrop-blur-lg overflow-y-auto flex flex-col p-4 md:p-8 animate-in fade-in duration-300">
					
					{/* Overlay Header Bar */}
					<div className="w-full flex items-center justify-between border-b border-zinc-200 dark:border-border/80 pb-4 mb-6 shrink-0">
						<div className="flex items-center gap-2.5">
							<Compass className="size-5 text-amber animate-spin-slow" />
							<div>
								<h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-zinc-900 dark:text-zinc-100">
									Manoj Mukherjee — Architecture Systems Radar
								</h3>
								<p className="text-[10px] font-mono text-zinc-500 dark:text-muted-foreground">
									Polished vector presentation model for Client & Dev partners
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="hidden md:flex gap-1.5 border-r border-zinc-200 dark:border-border/60 pr-4 mr-2 font-mono text-[9px] uppercase">
								<span className="text-emerald-600 dark:text-emerald-400">Adopt: {adoptCount}</span>
								<span className="text-zinc-300 dark:text-zinc-600">|</span>
								<span className="text-amber-800 dark:text-amber">Trial: {trialCount}</span>
								<span className="text-zinc-300 dark:text-zinc-600">|</span>
								<span className="text-blue-600 dark:text-blue-400">Assess: {assessCount}</span>
							</div>

							<button
								type="button"
								onClick={() => setIsFullscreen(false)}
								className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-border bg-zinc-100/50 dark:bg-background/50 hover:bg-zinc-200/50 dark:hover:bg-secondary text-zinc-700 dark:text-zinc-300 hover:text-foreground px-3 py-1.5 transition-all"
							>
								<X className="size-4" />
								<span>Exit Presentation</span>
							</button>
						</div>
					</div>

					{/* Widescreen 3-column deck */}
					<div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr_1.1fr] flex-1 items-start max-w-7xl mx-auto w-full pb-8">
						
						{/* SVG canvas stage */}
						<div className="flex flex-col items-center justify-center space-y-6 border border-zinc-200 dark:border-border/80 bg-zinc-100/50 dark:bg-zinc-900/10 rounded-xl p-5 md:p-8 w-full min-w-0">
							<div className="w-full flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center pb-3 border-b border-zinc-200 dark:border-border/60">
								<div className="relative w-full md:max-w-[200px]">
									<Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
									<input
										type="text"
										placeholder="Search stack..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full rounded-lg border border-zinc-200 dark:border-border bg-zinc-100/30 dark:bg-background/50 py-1.5 pl-9 pr-4 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-amber focus:outline-none"
									/>
								</div>

								{/* Zoom */}
								<div className="flex items-center border border-zinc-200 dark:border-border rounded-lg bg-zinc-100/30 dark:bg-background/40 p-0.5 overflow-hidden justify-between">
									<button
										type="button"
										onClick={handleZoomOut}
										className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all"
									>
										<ZoomOut className="size-4" />
									</button>
									<span className="px-3 font-mono text-xs text-muted-foreground min-w-[44px] text-center">
										{Math.round(zoom * 100)}%
									</span>
									<button
										type="button"
										onClick={handleZoomIn}
										className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all"
									>
										<ZoomIn className="size-4" />
									</button>
									<button
										type="button"
										onClick={handleZoomReset}
										className="p-1.5 border-l border-zinc-200 dark:border-border hover:bg-zinc-200 dark:hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all"
									>
										<RefreshCw className="size-3.5" />
									</button>
								</div>
							</div>

							{/* Focus quadrant tabs */}
							<div className="w-full flex flex-wrap gap-1 justify-start">
								<button
									type="button"
									onClick={() => handleFocusQuadrant("All")}
									className={cn(
										"rounded px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider transition-all border font-semibold",
										activeQuadrant === "All"
											? "bg-amber-100/50 dark:bg-amber/15 border-amber-300 dark:border-amber/40 text-amber-800 dark:text-amber"
											: "bg-zinc-100/50 dark:bg-secondary/10 border-zinc-200 dark:border-border/20 text-muted-foreground hover:bg-zinc-200 dark:hover:bg-secondary hover:text-foreground"
									)}
								>
									Fit All
								</button>
								{(Object.keys(radarQuadrants) as Array<keyof typeof radarQuadrants>).map((key) => (
									<button
										key={key}
										type="button"
										onClick={() => handleFocusQuadrant(key)}
										onMouseEnter={() => setHoveredQuadrant(key)}
										onMouseLeave={() => setHoveredQuadrant(null)}
										className={cn(
											"rounded px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider transition-all border",
											activeQuadrant === key
												? "bg-amber-100/50 dark:bg-amber/15 border-amber-300 dark:border-amber/40 text-amber-800 dark:text-amber font-semibold"
												: "bg-zinc-100/50 dark:bg-secondary/10 border-zinc-200 dark:border-border/20 text-muted-foreground hover:bg-zinc-200 dark:hover:bg-secondary hover:text-foreground"
										)}
									>
										Focus: {radarQuadrants[key].name}
									</button>
								))}
							</div>

							{/* Canvas scale SVG */}
							{renderRadarSVG("max-w-[460px]")}
						</div>

						{/* Directory panel */}
						<div className="border border-zinc-200 dark:border-border/80 bg-zinc-100/40 dark:bg-zinc-900/10 rounded-xl p-5 flex flex-col max-h-[640px] overflow-y-auto w-full min-w-0">
							<div className="flex items-center justify-between border-b border-zinc-200 dark:border-border/60 pb-3 mb-3 shrink-0">
								<div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-100">
									<Grid className="size-4 text-amber" />
									<span>Systems Directory</span>
								</div>

								<div className="flex border border-zinc-200 dark:border-border rounded p-0.5 bg-zinc-100/50 dark:bg-zinc-950/20">
									<button
										type="button"
										onClick={() => setGroupBy("ring")}
										className={cn(
											"opacity-100 px-2 py-0.5 rounded text-[8px] font-mono uppercase transition-all",
											groupBy === "ring" ? "bg-amber-100/50 dark:bg-amber/15 text-amber-800 dark:text-amber font-semibold" : "text-muted-foreground"
										)}
									>
										Ring
									</button>
									<button
										type="button"
										onClick={() => setGroupBy("quadrant")}
										className={cn(
											"opacity-100 px-2 py-0.5 rounded text-[8px] font-mono uppercase transition-all ml-1",
											groupBy === "quadrant" ? "bg-amber-100/50 dark:bg-amber/15 text-amber-800 dark:text-amber font-semibold" : "text-muted-foreground"
										)}
									>
										Quadrant
									</button>
								</div>
							</div>

							<div className="space-y-4 min-w-0">
								{renderDirectoryGroupings()}
							</div>
						</div>

						{/* ADR detail sheet */}
						<div className="border border-zinc-200 dark:border-border/80 bg-zinc-100/40 dark:bg-zinc-900/10 rounded-xl p-5 md:p-6 space-y-4 max-h-[640px] overflow-y-auto w-full min-w-0">
							<div className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-border/60 pb-3 shrink-0">
								<Radio className="size-4 text-amber animate-pulse shrink-0" />
								<span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-850 dark:text-zinc-100">
									ADR Technical Document
								</span>
							</div>

							<div className="space-y-4 min-w-0">
								<div>
									<div className="flex items-center justify-between">
										<span className="font-mono text-[10px] text-amber-800/80 dark:text-amber/80 uppercase tracking-widest">
											{radarQuadrants[activeItem.quadrant].name}
										</span>
										<span className={cn(
											"rounded px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-wide border shrink-0",
											activeItem.ring === "Adopt" && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
											activeItem.ring === "Trial" && "bg-amber-50 dark:bg-amber/10 text-amber-800 dark:text-amber border-amber-200 dark:border-amber/20",
											activeItem.ring === "Assess" && "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
											activeItem.ring === "Hold" && "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
										)}>
											{activeItem.verdict}
										</span>
									</div>
									<h4 className="mt-1 text-xl font-normal text-zinc-900 dark:text-zinc-100 truncate">
										{activeItem.name}
									</h4>
								</div>

								{/* System Insight */}
								<div className="rounded-lg border border-zinc-200 dark:border-border bg-white dark:bg-secondary/15 p-4 font-mono text-xs leading-relaxed break-words">
									<span className="text-muted-foreground/60 block uppercase font-bold tracking-wider mb-1">&gt; System Insight:</span>
									<p className="text-zinc-700 dark:text-zinc-300 leading-normal font-sans text-xs">{activeItem.insight}</p>
								</div>

								{/* Detailed ADR breakdown */}
								{renderADR(activeItem)}
							</div>
						</div>

					</div>
				</div>
			)}
		</div>
	);
}
