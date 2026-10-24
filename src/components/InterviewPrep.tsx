import React, { useState, useEffect } from 'react';
import { Target, Clock, ChevronDown, ChevronUp, Cpu, Server, Database, MessageSquare } from 'lucide-react';

export const InterviewPrep: React.FC = () => {
  // Tuesday, Oct 27, 2026 at 2:00 PM PST
  const targetDate = new Date('2026-10-27T14:00:00-08:00');

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 20,
    mins: 41,
    secs: 11
  });

  const [openCard, setOpenCard] = useState<number | null>(1);

  useEffect(() => {
    const updateCountdown = () => {
      // Reference simulated date: Oct 24, 2026 17:18:49 +05:30
      const refNow = new Date('2026-10-24T17:18:49+05:30');
      const diffMs = targetDate.getTime() - refNow.getTime();

      if (diffMs > 0) {
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diffMs / 1000 / 60) % 60);
        const secs = Math.floor((diffMs / 1000) % 60);
        setTimeLeft({ days, hours, mins, secs });
      }
    };

    updateCountdown();
  }, []);

  const toggleCard = (index: number) => {
    setOpenCard(openCard === index ? null : index);
  };

  return (
    <div className="space-y-8">
      {/* Target Interview Hero */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Target className="w-3.5 h-3.5" />
            Earliest Upcoming Interview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            OpenAI &bull; Research Engineer
          </h2>
          <p className="text-sm text-slate-300 mt-1 font-medium">
            Round: <span className="text-cyan-400 font-semibold">System Architecture</span> &bull; Tuesday, Oct 27, 2026 @ 2:00 PM PST via Google Meet
          </p>
        </div>

        {/* Live Countdown Clock */}
        <div className="flex items-center gap-2 p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
          <div className="flex flex-col items-center min-w-[50px]">
            <span className="text-2xl sm:text-3xl font-extrabold font-display text-cyan-400 leading-none">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Days</span>
          </div>
          <span className="text-xl font-bold text-slate-600">:</span>
          <div className="flex flex-col items-center min-w-[50px]">
            <span className="text-2xl sm:text-3xl font-extrabold font-display text-cyan-400 leading-none">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Hours</span>
          </div>
          <span className="text-xl font-bold text-slate-600">:</span>
          <div className="flex flex-col items-center min-w-[50px]">
            <span className="text-2xl sm:text-3xl font-extrabold font-display text-cyan-400 leading-none">
              {String(timeLeft.mins).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Mins</span>
          </div>
        </div>
      </div>

      {/* Core Architectural Focus Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1.5">1. Distributed Memory &amp; Sharding</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Master 3D parallelism: Megatron-LM tensor &amp; pipeline parallelism, DeepSpeed ZeRO-1/2/3 partitioning (optimizer state, gradients, model parameters), and PyTorch FSDP.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <Server className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1.5">2. Low-Latency Inference (vLLM)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deep dive on PagedAttention (non-contiguous KV cache allocation), FlashAttention-2/3 IO-awareness, dynamic continuous batching, and Speculative Decoding speedups.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1.5">3. Cluster Networking &amp; Checkpoints</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            InfiniBand multi-rail topologies with RoCEv2, NCCL ring All-Reduce straggler isolation via DCGM, and non-blocking asynchronous checkpoint streaming.
          </p>
        </div>
      </div>

      {/* Interactive Flashcard Simulator */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <span>High-Difficulty System Design Practice Questions</span>
          <span className="text-[11px] text-slate-500 font-normal">(Click question to toggle model solution)</span>
        </h3>

        {/* Question 1 */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 transition overflow-hidden">
          <div
            onClick={() => toggleCard(1)}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/50"
          >
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold text-sm">Q1</span>
              <h4 className="text-sm font-semibold text-white">
                Design a Multi-Tenant Inference Platform for a 70B Model at 50,000 QPS with p99 TTFT &lt; 150ms
              </h4>
            </div>
            {openCard === 1 ? <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />}
          </div>

          {openCard === 1 && (
            <div className="p-5 pt-0 border-t border-slate-800/80 text-xs text-slate-300 space-y-2 bg-slate-950/40">
              <div className="font-bold text-cyan-400 mb-1">Key Architectural Talking Points:</div>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300 leading-relaxed">
                <li><strong className="text-white">Parallelism:</strong> Tensor Parallelism over 8x H100 GPUs (NVLink interconnect) with Pipeline Parallelism for batch scaling across nodes.</li>
                <li><strong className="text-white">Memory Management:</strong> Implement PagedAttention with prompt prefix caching to reuse shared system instructions across requests.</li>
                <li><strong className="text-white">Scheduler:</strong> Iteration-level dynamic continuous batching with fair-share token queues preventing monopolization by long outputs.</li>
                <li><strong className="text-white">Speculative Decoding:</strong> Utilize a co-located 3B parameter draft model on auxiliary GPUs to emit multiple verified tokens per step, cutting latency by 2.2x.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Question 2 */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 transition overflow-hidden">
          <div
            onClick={() => toggleCard(2)}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/50"
          >
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold text-sm">Q2</span>
              <h4 className="text-sm font-semibold text-white">
                Isolating Intermittent Straggler Stall During 3D-Parallel Training Across 4,096 GPUs
              </h4>
            </div>
            {openCard === 2 ? <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />}
          </div>

          {openCard === 2 && (
            <div className="p-5 pt-0 border-t border-slate-800/80 text-xs text-slate-300 space-y-2 bg-slate-950/40">
              <div className="font-bold text-cyan-400 mb-1">Diagnostic Protocol:</div>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300 leading-relaxed">
                <li><strong className="text-white">Telemetry Correlation:</strong> Use PyTorch Profiler + NCCL trace logs to pinpoint the exact rank lagging in the All-Reduce ring synchronization.</li>
                <li><strong className="text-white">Hardware Health:</strong> Check DCGM hardware telemetry for thermal throttling, power limits, and uncorrectable ECC errors.</li>
                <li><strong className="text-white">Network Fabric:</strong> Inspect InfiniBand subnet manager counters for RoCE PFC pause storms, cable eye-diagram degradations, and packet drop events.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Question 3 */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 transition overflow-hidden">
          <div
            onClick={() => toggleCard(3)}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/50"
          >
            <div className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold text-sm">Q3</span>
              <h4 className="text-sm font-semibold text-white">
                Architecting a 100TB/Day Streaming Multi-Modal Ingestion &amp; Deduplication Pipeline
              </h4>
            </div>
            {openCard === 3 ? <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />}
          </div>

          {openCard === 3 && (
            <div className="p-5 pt-0 border-t border-slate-800/80 text-xs text-slate-300 space-y-2 bg-slate-950/40">
              <div className="font-bold text-cyan-400 mb-1">Architecture Blueprint:</div>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300 leading-relaxed">
                <li><strong className="text-white">Deduplication:</strong> Distributed MinHash LSH (Locality Sensitive Hashing) combined with persistent Bloom filters in high-speed Redis / NVMe pools.</li>
                <li><strong className="text-white">Tokenization:</strong> CPU-isolated Rust tokenizer worker ring writing directly to memory-mapped Parquet/Arrow sharded chunks.</li>
                <li><strong className="text-white">Zero-Copy Prefetch:</strong> Double-buffered host memory pinned to GPU device memory through asynchronous CUDA streaming pipelines.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Reverse-Interview Questions */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          High-Signal Reverse-Interview Questions (To Ask OpenAI Interviewers)
        </h3>
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="font-bold text-slate-300 block mb-1">Question 1:</span>
            <p className="text-slate-400 italic">
              "How does your infrastructure team balance raw cluster compute utilization against rapid experimentation velocity when research teams need to dynamically alter parallelization topologies on shared GPU clusters?"
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="font-bold text-slate-300 block mb-1">Question 2:</span>
            <p className="text-slate-400 italic">
              "With the growing shift toward agentic workloads and long-running context streams, how are your systems evolving to handle KV-cache persistence across multi-turn reasoning workflows?"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
