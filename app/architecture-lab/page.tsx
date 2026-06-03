import { LabDashboard } from "@/components/marketing/lab-dashboard";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Architecture Lab | AI Systems Prototypes",
  description:
    "Interactive architecture maps and empirical experiment logs for multi-agent systems, RAG infrastructure, and async backend platforms.",
  path: "/architecture-lab",
});

const experiments = [
  {
    id: "EXP-01",
    name: "Context Overlap vs Reranker Relevancy",
    goal: "Evaluate prompt window token efficiency by comparing raw cosine distance retrievals to cross-encoder reranked outputs.",
    metrics: "45% token size reduction, 14% higher validation grounding score, +32ms retrieval latency.",
    status: "Completed",
    outcome: "Using Cohere-v3 rerank to filter pgvector top-20 down to top-5 delivers optimal grounding confidence while saving significant token overhead.",
  },
  {
    id: "EXP-02",
    name: "Ollama Local Routing Latency under Load",
    goal: "Verify if small local models (DeepSeek-R1-Distill-Qwen-14B) can perform fast router node checks compared to cloud models (GPT-4o-mini).",
    metrics: "Local: 42ms routing decision, 92.5% accuracy. Cloud: 180ms routing decision, 95% accuracy.",
    status: "Active",
    outcome: "Local Qwen-14B runs routes faster with minimal accuracy degradation. Ideal for keeping sub-agent intent classification within private networks.",
  },
  {
    id: "EXP-03",
    name: "Durable Thread Resiliency under Timeout Faults",
    goal: "Measure LangGraph Postgres checkpoint recoverability during forced database connection loss.",
    metrics: "100% thread recovery on restart, 0 lost checkpoints, 82ms state recovery overhead.",
    status: "Completed",
    outcome: "PostgreSQL checkpoints write transactional state transitions atomically, allowing suspended graph workflows to resume without data loss.",
  },
];

export default function ArchitectureLabPage() {
  return (
    <>
      <PageHero
        kicker="Architecture Lab"
        title="AI systems prototypes, mapped empirically."
        description="This is the experimentation and topology workshop: active system flows, modular agent node interactions, and trace logs showing how platform design choices translate to performance."
      />

      <Section className="border-b border-border">
        <SectionHeader
          kicker="System Topologies"
          title="Trace the flow of production AI backends."
          description="Select a system pattern below to inspect components, inputs, outputs, performance metrics, and potential runtime failure modes."
        />
        <div className="mt-14">
          <LabDashboard />
        </div>
      </Section>

      <Section>
        <SectionHeader
          kicker="Empirical Log"
          title="Active engineering experiments and benchmarks."
          description="Production AI systems are defined by performance facts, not marketing claims. These logs list structured measurements from local and cloud-based sandbox environments."
        />

        <div className="mt-14 overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-sans text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/20 font-mono text-xs uppercase tracking-wider text-muted-foreground/80">
                  <th className="p-4 w-20">ID</th>
                  <th className="p-4 min-w-[15rem]">Experiment Target</th>
                  <th className="p-4 min-w-[20rem]">Empirical Metrics</th>
                  <th className="p-4 w-28 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {experiments.map((exp) => (
                  <tr key={exp.id} className="hover:bg-secondary/10">
                    <td className="p-4 font-mono font-semibold text-amber align-top">
                      {exp.id}
                    </td>
                    <td className="p-4 align-top">
                      <p className="font-medium text-foreground">{exp.name}</p>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-normal">
                        {exp.goal}
                      </p>
                    </td>
                    <td className="p-4 align-top text-xs text-muted-foreground leading-normal">
                      <div className="rounded border border-border/50 bg-secondary/10 px-3 py-2 font-mono">
                        <p className="text-foreground font-semibold mb-1">&gt; METRICS:</p>
                        <p>{exp.metrics}</p>
                        <p className="text-foreground/90 font-semibold mt-2 mb-1">&gt; OUTCOME:</p>
                        <p>{exp.outcome}</p>
                      </div>
                    </td>
                    <td className="p-4 align-top text-right text-xs font-mono">
                      <span
                        className={cn(
                          "inline-block rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                          exp.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-amber/10 text-amber border border-amber/20"
                        )}
                      >
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <CtaBand title="Need custom benchmarks for your agentic infrastructure?" />
    </>
  );
}
