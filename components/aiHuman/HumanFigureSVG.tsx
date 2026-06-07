"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { bodyParts } from "./bodyPartData";
import type { BodyPart } from "./bodyPartData";

interface HumanFigureSVGProps {
  activePart: string | null;
  signalPath: { from: string; to: string } | null;
  onPartClick: (partId: string) => void;
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  cyan: "#22d3ee",
  blue: "#3b82f6",
  violet: "#8b5cf6",
  red: "#ef4444",
  amber: "#f59e0b",
  orange: "#f97316",
  green: "#22c55e",
};

const LABEL_PLACEMENTS: Record<
  string,
  { x: number; y: number; anchor: "start" | "middle" | "end" }
> = {
  brain: { x: 286, y: 62, anchor: "start" },
  memory: { x: 96, y: 86, anchor: "end" },
  eyes: { x: 294, y: 126, anchor: "start" },
  ears: { x: 82, y: 132, anchor: "end" },
  mouth: { x: 294, y: 166, anchor: "start" },
  lungs: { x: 78, y: 260, anchor: "end" },
  heart: { x: 292, y: 294, anchor: "start" },
  skin: { x: 352, y: 232, anchor: "start" },
  "nervous-system": { x: 292, y: 366, anchor: "start" },
  gut: { x: 292, y: 438, anchor: "start" },
  reflexes: { x: 72, y: 468, anchor: "end" },
  hands: { x: 350, y: 412, anchor: "start" },
};

const WARM_WHITE = "#f8f3ea";
const SOFT_LINE = "rgba(248, 243, 234, 0.16)";

function edgeKey(a: string, b: string) {
  return [a, b].sort().join("--");
}

function signalPathD(
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const cx = mx + (to.y - from.y) * 0.12;
  const cy = my - (to.x - from.x) * 0.12;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

function labelBoxX(
  placement: { x: number; anchor: "start" | "middle" | "end" },
  width: number,
) {
  if (placement.anchor === "end") return placement.x - width;
  if (placement.anchor === "middle") return placement.x - width / 2;
  return placement.x;
}

export default function HumanFigureSVG({
  activePart,
  signalPath,
  onPartClick,
  className = "",
}: HumanFigureSVGProps) {
  const edges = useMemo(() => {
    const seen = new Set<string>();
    const result: { from: BodyPart; to: BodyPart; key: string }[] = [];

    Object.values(bodyParts).forEach((part) => {
      part.connections.forEach((connectionId) => {
        const connection = bodyParts[connectionId];
        const key = edgeKey(part.id, connectionId);

        if (!connection || seen.has(key)) return;

        seen.add(key);
        result.push({ from: part, to: connection, key });
      });
    });

    return result;
  }, []);

  const parts = useMemo(() => Object.values(bodyParts), []);

  return (
    <svg
      viewBox="0 0 420 760"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-full w-full ${className}`}
      aria-labelledby="ai-human-anatomy-title ai-human-anatomy-desc"
      role="group"
    >
      <title id="ai-human-anatomy-title">
        Human anatomy mapped to AI architecture
      </title>
      <desc id="ai-human-anatomy-desc">
        Interactive anatomy diagram comparing body systems with AI system
        components such as LLMs, GraphRAG, MCP, tools, context, and guardrails.
      </desc>

      <defs>
        <linearGradient id="skin-shell" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fbf5e8" stopOpacity="0.2" />
          <stop offset="55%" stopColor="#f7c984" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.08" />
        </linearGradient>

        <radialGradient id="body-aura" cx="50%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#f8f3ea" stopOpacity="0.09" />
          <stop offset="72%" stopColor="#0ea5e9" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <filter id="soft-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="active-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {parts.map((part) => {
          const color = COLOR_MAP[part.color] ?? WARM_WHITE;

          return (
            <radialGradient key={part.id} id={`part-${part.id}`}>
              <stop offset="0%" stopColor={color} stopOpacity="0.58" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          );
        })}
      </defs>

      <rect width="420" height="760" fill="transparent" />
      <ellipse cx="210" cy="332" rx="186" ry="312" fill="url(#body-aura)" />

      <path
        d="M210 34 C238 34 258 57 258 88 C258 118 239 141 222 149 L222 168 C273 173 315 198 333 241 C352 286 357 341 349 399 C346 418 323 419 318 399 C310 347 302 297 284 259 L274 409 C274 470 295 522 303 657 C305 687 263 692 257 661 L224 505 C221 488 199 488 196 505 L163 661 C157 692 115 687 117 657 C125 522 146 470 146 409 L136 259 C118 297 110 347 102 399 C97 419 74 418 71 399 C63 341 68 286 87 241 C105 198 147 173 198 168 L198 149 C181 141 162 118 162 88 C162 57 182 34 210 34 Z"
        fill="url(#skin-shell)"
        stroke="rgba(248, 243, 234, 0.32)"
        strokeWidth="1.3"
      />

      <path
        d="M142 219 C178 202 242 202 278 219 M146 243 C184 232 236 232 274 243 M154 331 C190 347 230 347 266 331"
        fill="none"
        stroke="rgba(248, 243, 234, 0.13)"
        strokeLinecap="round"
        strokeWidth="1.1"
      />

      <g aria-hidden="true">
        <path
          d="M178 83 C180 58 198 50 214 57 C230 50 245 62 245 84 C245 110 224 125 201 118 C186 122 174 108 178 83 Z"
          fill="rgba(34, 211, 238, 0.18)"
          stroke="rgba(34, 211, 238, 0.55)"
          strokeWidth="1"
        />
        <path
          d="M186 78 C196 70 205 72 212 82 M214 63 C218 76 217 91 209 103 M196 103 C206 96 220 98 232 108 M186 94 C197 90 204 93 209 103"
          fill="none"
          stroke="rgba(34, 211, 238, 0.55)"
          strokeLinecap="round"
          strokeWidth="0.9"
        />

        <circle cx="198" cy="122" r="3" fill="rgba(59, 130, 246, 0.9)" />
        <circle cx="222" cy="122" r="3" fill="rgba(59, 130, 246, 0.9)" />
        <path
          d="M191 156 Q210 165 229 156"
          fill="none"
          stroke="rgba(139, 92, 246, 0.8)"
          strokeLinecap="round"
          strokeWidth="1.3"
        />
        <path
          d="M150 111 C132 118 130 139 145 148 M270 111 C288 118 290 139 275 148"
          fill="none"
          stroke="rgba(59, 130, 246, 0.48)"
          strokeLinecap="round"
          strokeWidth="1.1"
        />

        <path
          d="M210 151 C210 194 210 238 210 286 C210 338 210 410 210 488"
          fill="none"
          stroke="rgba(245, 158, 11, 0.75)"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          d="M210 196 C190 208 168 219 151 239 M210 196 C230 208 252 219 269 239 M210 280 C188 292 166 306 147 327 M210 280 C232 292 254 306 273 327 M210 365 C188 379 164 393 135 408 M210 365 C232 379 256 393 285 408"
          fill="none"
          stroke="rgba(245, 158, 11, 0.28)"
          strokeLinecap="round"
          strokeWidth="1.2"
        />

        <path
          d="M181 226 C153 225 137 252 144 288 C149 317 171 326 190 309 C195 286 194 248 181 226 Z"
          fill="rgba(34, 211, 238, 0.13)"
          stroke="rgba(34, 211, 238, 0.5)"
          strokeWidth="1"
        />
        <path
          d="M239 226 C267 225 283 252 276 288 C271 317 249 326 230 309 C225 286 226 248 239 226 Z"
          fill="rgba(34, 211, 238, 0.13)"
          stroke="rgba(34, 211, 238, 0.5)"
          strokeWidth="1"
        />

        <path
          d="M222 267 C236 250 258 263 254 284 C251 304 230 318 222 327 C214 318 193 304 190 284 C186 263 208 250 222 267 Z"
          fill="rgba(239, 68, 68, 0.22)"
          stroke="rgba(239, 68, 68, 0.65)"
          strokeWidth="1"
        />

        <path
          d="M189 388 C175 374 176 350 198 346 C217 342 232 357 226 376 C221 394 199 404 189 420"
          fill="none"
          stroke="rgba(249, 115, 22, 0.62)"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          d="M181 430 C200 414 224 416 240 432 C222 451 198 451 181 430 Z"
          fill="rgba(249, 115, 22, 0.12)"
          stroke="rgba(249, 115, 22, 0.48)"
          strokeWidth="1"
        />

        <path
          d="M307 339 L330 351 L326 380 C321 397 307 407 293 412 C279 407 265 397 260 380 L256 351 L279 339 C287 344 299 344 307 339 Z"
          fill="rgba(249, 115, 22, 0.1)"
          stroke="rgba(249, 115, 22, 0.45)"
          strokeWidth="1"
        />
      </g>

      {edges.map(({ from, to, key }) => {
        const active =
          signalPath &&
          ((signalPath.from === from.id && signalPath.to === to.id) ||
            (signalPath.from === to.id && signalPath.to === from.id));
        const color = COLOR_MAP[to.color] ?? WARM_WHITE;

        return (
          <motion.path
            key={key}
            d={signalPathD(from.position, to.position)}
            fill="none"
            stroke={active ? color : SOFT_LINE}
            strokeLinecap="round"
            strokeWidth={active ? 1.8 : 0.8}
            initial={{ opacity: 0.28 }}
            animate={{
              opacity: active ? [0.45, 0.95, 0.45] : [0.16, 0.32, 0.16],
            }}
            transition={{
              duration: active ? 0.9 : 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      <AnimatePresence>
        {signalPath &&
          bodyParts[signalPath.from] &&
          bodyParts[signalPath.to] && (
            <motion.circle
              key={`${signalPath.from}-${signalPath.to}`}
              r={5}
              fill={COLOR_MAP[bodyParts[signalPath.to].color] ?? WARM_WHITE}
              filter="url(#active-glow)"
              initial={{
                cx: bodyParts[signalPath.from].position.x,
                cy: bodyParts[signalPath.from].position.y,
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                cx: bodyParts[signalPath.to].position.x,
                cy: bodyParts[signalPath.to].position.y,
                opacity: [0, 1, 1, 0],
                scale: [0.7, 1.2, 1.2, 0.7],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
            />
          )}
      </AnimatePresence>

      {parts.map((part) => {
        const isActive = activePart === part.id;
        const color = COLOR_MAP[part.color] ?? WARM_WHITE;
        const placement = LABEL_PLACEMENTS[part.id];
        const labelWidth = part.aiLabel.length > 17 ? 106 : 92;
        const labelX = placement ? labelBoxX(placement, labelWidth) : 0;

        return (
          <g key={part.id}>
            {placement ? (
              <g pointerEvents="none">
                <path
                  d={`M ${part.position.x} ${part.position.y} L ${placement.x} ${placement.y + 4}`}
                  stroke={isActive ? color : "rgba(248, 243, 234, 0.16)"}
                  strokeWidth={isActive ? 1 : 0.7}
                  strokeDasharray="3 4"
                  fill="none"
                />
                <rect
                  x={labelX}
                  y={placement.y - 13}
                  width={labelWidth}
                  height={31}
                  rx={4}
                  fill={isActive ? `${color}22` : "rgba(10, 10, 12, 0.52)"}
                  stroke={isActive ? `${color}aa` : "rgba(248, 243, 234, 0.12)"}
                  strokeWidth="0.7"
                />
                <text
                  x={placement.x}
                  y={placement.y - 2}
                  textAnchor={placement.anchor}
                  fill={isActive ? color : "rgba(248, 243, 234, 0.72)"}
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                  fontSize="8.5"
                  fontWeight="700"
                >
                  {part.label}
                </text>
                <text
                  x={placement.x}
                  y={placement.y + 10}
                  textAnchor={placement.anchor}
                  fill="rgba(248, 243, 234, 0.46)"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fontSize="6.8"
                >
                  {part.aiLabel}
                </text>
              </g>
            ) : null}

            <g
              onClick={() => onPartClick(part.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onPartClick(part.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${part.label}: ${part.aiLabel}`}
              style={{ cursor: "pointer" }}
            >
              {isActive ? (
                <motion.circle
                  cx={part.position.x}
                  cy={part.position.y}
                  r={24}
                  fill={`url(#part-${part.id})`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.9, 1.12, 0.9] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              ) : null}
              <motion.circle
                cx={part.position.x}
                cy={part.position.y}
                r={isActive ? 11 : 8}
                fill={isActive ? color : "rgba(10, 10, 12, 0.85)"}
                stroke={isActive ? WARM_WHITE : color}
                strokeOpacity={isActive ? 0.9 : 0.55}
                strokeWidth={isActive ? 1.5 : 1}
                filter={isActive ? "url(#active-glow)" : "url(#soft-glow)"}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                animate={{
                  scale: isActive ? [0.92, 1.08, 0.92] : [0.94, 1.04, 0.94],
                  opacity: isActive ? 1 : [0.74, 0.95, 0.74],
                }}
                transition={{ duration: isActive ? 1.4 : 2.6, repeat: Infinity }}
              />
              <text
                x={part.position.x}
                y={part.position.y + 2.6}
                textAnchor="middle"
                fill={isActive ? "#09090b" : WARM_WHITE}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontSize={part.icon.length > 3 ? 4.7 : 6.3}
                fontWeight="800"
                pointerEvents="none"
              >
                {part.icon}
              </text>
              <circle cx={part.position.x} cy={part.position.y} r={22} fill="transparent" />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
