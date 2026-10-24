import { ProcessedApplication, InterviewBrief } from '../types';

export function getUpcomingInterviewBrief(applications: ProcessedApplication[]): InterviewBrief | null {
  const interviewApp = applications.find((a) => a.stage === 'INTERVIEW_SCHEDULED');

  if (!interviewApp) {
    return null;
  }

  // Tailored OpenAI Research Engineer brief
  return {
    company: interviewApp.companyName,
    role: interviewApp.roleTitle,
    interviewDate: '2026-10-27T14:00:00-08:00', // Tuesday, Oct 27, 2026 @ 2:00 PM PST
    technicalTopics: [
      'Distributed Parallelism & Sharding: Megatron-LM Tensor and Pipeline Parallelism, DeepSpeed ZeRO-1/2/3 parameter & gradient partitioning, PyTorch FSDP',
      'Low-Latency Inference Acceleration: PagedAttention KV cache virtualization in vLLM, FlashAttention-2/3 IO-awareness, Continuous Batching, Speculative Decoding',
      'High-Throughput Streaming Ingestion & Deduplication: Distributed MinHash LSH, asynchronous double-buffered ring memory, zero-copy CUDA streaming'
    ],
    deepDiveQuestions: [
      'Design a multi-tenant inference platform serving a 70B parameter LLM at 50,000 QPS with p99 TTFT < 150ms. Address tensor-parallel sharding across 8x H100s, shared prefix caching in PagedAttention, and continuous iteration scheduling.',
      'During 3D-parallel training of a frontier foundation model across 4,096 GPUs, All-Reduce ring synchronization stalls intermittently. Walk through your systematic DCGM, NCCL trace, and InfiniBand RoCE PFC telemetry isolation steps.',
      'Architect a fault-tolerant streaming ingestion and tokenization engine consuming 100TB/day of multi-modal web data with strict Bloom filter deduplication without starving GPU dataloaders.'
    ],
    reverseInterviewQuestions: [
      'How does the infrastructure team balance raw cluster compute utilization against rapid experimentation velocity when research teams need to dynamically alter parallelization topologies on shared clusters?',
      'With the growing shift toward agentic workloads and long-running context streams, how are your systems evolving to handle KV-cache persistence across multi-turn reasoning workflows?'
    ]
  };
}
