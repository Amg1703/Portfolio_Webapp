export const profile = {
  name: "Arjun Mageswaran",
  role: "AI / LLM Engineer",
  location: "Sydney, Australia",
  intro: [
    "I'm an AI engineer in Sydney. At the moment I'm moving Valeon Partners' deal process off spreadsheets and laptops and onto a multi-agent platform on Azure, and building search and recommendation systems at Deckoviz.",
    "The parts I spend most of my time on are the unglamorous ones: whether retrieval actually finds the right chunk, whether a guardrail is enforced by the database or only by good intentions, and what happens when a run dies halfway through.",
  ],
  building: [
    "multi-agent platforms on Azure",
    "hybrid-search RAG pipelines",
    "agent runs that survive a crash",
    "CLIP-powered recommendation engines",
    "guardrails the database enforces",
  ],
  now: [
    { label: "Contract AI Engineer", detail: "Valeon Partners" },
    { label: "AI/LLM Intern", detail: "Deckoviz Space Labs" },
    { label: "MSc Computer Science", detail: "University of Sydney" },
  ],
  summary: [
    "I'm an AI/LLM engineer working across the full stack of applied AI: retrieval, agent orchestration, model training, and the distributed backend and cloud infrastructure underneath.",
    "I currently work as a contract AI engineer for Valeon Partners, a capital-markets advisory firm, designing a multi-agent platform for its deal process. Alongside that I'm an AI/LLM intern at Deckoviz Space Labs, shipping search and recommendation systems on FastAPI, vector databases and Kubernetes, and I'm doing a Master of Computer Science (Data Science & AI) at the University of Sydney.",
  ],
  github: "https://github.com/Amg1703",
  linkedin: "https://www.linkedin.com/in/arjun-mageswaran-a5b694362",
  resume: "/Arjun-Mageswaran-Resume.pdf",
  // Drop your LinkedIn photo at public/profile.jpg; initials are shown until then.
  avatar: "/profile.jpg",
  initials: "AMG",
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  points: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    company: "Valeon Partners",
    role: "AI Engineer (Contract)",
    period: "2026 – Present",
    location: "Remote",
    points: [
      "Consolidated three separate, file-based deal engines into one unified platform design on Azure, covering the firm's end-to-end capital-raising process from engagement to close.",
      "Designed a supervisor / sub-agent orchestration layer (5 supervisors over 65 sub-agents) with checkpointing, crash-resume without re-spending tokens, out-of-sequence module runs and human approval gates that genuinely block.",
      "Mapped the platform onto Azure: Durable Functions for orchestration, checkpointing and scheduling; Container Apps for the agent runtime and Playwright browser automation; AI Foundry for model access; PostgreSQL Flexible Server with pgvector; Blob Storage, Key Vault and Entra ID SSO; Static Web Apps for the portal; and Application Insights for observability.",
      "Modelled the domain as a 79-table PostgreSQL schema with views, triggers and row-level security, so compliance guardrails are enforced by the database rather than by convention.",
      "Built a Python prototype with a conformance suite and an adversarial test harness that attempts to break each guardrail, then turned the results into a ranked risk register to guide the build.",
    ],
    stack: ["Azure Durable Functions", "Azure Container Apps", "Azure AI Foundry", "Azure Database for PostgreSQL", "pgvector", "Azure Blob Storage", "Microsoft Entra ID", "Azure Key Vault", "Azure Static Web Apps", "Application Insights", "Microsoft Graph", "Anthropic Claude", "Playwright", "Python", "PostgreSQL RLS"],
  },
  {
    company: "Deckoviz Space Labs",
    role: "AI/LLM Intern",
    period: "Aug 2025 – Present",
    location: "Remote",
    points: [
      "Built a Persona Search System with FastAPI, Weaviate, PostgreSQL, OpenAI embeddings and LlamaIndex pipelines, using LLM reranking and Qdrant hybrid dense-sparse retrieval. Redis caching and tuned retrieval cut query latency by 40%.",
      "Developed a multimodal visual + text music recommendation engine using CLIP image embeddings, Weaviate similarity search and LangGraph reasoning, raising recommendation relevance by 35% with model versions tracked in MLflow.",
      "Designed async distributed workflows on Redis, Celery and Kafka for background inference and embedding caching; the Pub/Sub architecture reduced system latency by 20%.",
      "Containerised AI microservices with Docker, deployed via Kubernetes, Helm, GitHub Actions and ArgoCD to AWS (EKS, S3, SageMaker, Lambda) behind Nginx, monitored with Prometheus and Grafana, cutting downtime by 25%.",
    ],
    stack: ["FastAPI", "Weaviate", "Qdrant", "LlamaIndex", "LangGraph", "Kafka", "Kubernetes", "AWS"],
  },
];

export type Project = {
  title: string;
  description: string;
  highlights?: string[];
  stack: string[];
  repo?: string;
  featured?: boolean;
};

const gh = (repo: string) => `https://github.com/Amg1703/${repo}`;

export const projects: Project[] = [
  {
    title: "Valeon Capital Markets Engine",
    description:
      "A governed multi-agent platform design for Valeon Partners, replacing three laptop-bound, file-based deal engines with one orchestrated, database-backed system on Azure.",
    highlights: [
      "5 supervisors over 65 sub-agents, with checkpoint/resume, run modes and blocking human approval gates",
      "79-table PostgreSQL schema with views, triggers and row-level security enforcing compliance guardrails",
      "Azure-native: Durable Functions, Container Apps, AI Foundry, PostgreSQL Flexible Server + pgvector, Blob Storage, Key Vault, Entra ID, Static Web Apps, App Insights",
      "The firm's whole process stored as data: 7 stages, 34 phases, 65 modules, 14 external connectors",
      "Conformance suite plus an adversarial harness that tries to break every guardrail, feeding a ranked risk register",
    ],
    stack: ["Azure Durable Functions", "Azure Container Apps", "Azure AI Foundry", "Azure Database for PostgreSQL", "pgvector", "Azure Blob Storage", "Microsoft Entra ID", "Azure Key Vault", "Azure Static Web Apps", "Application Insights", "Microsoft Graph", "Anthropic Claude", "Playwright", "Python", "PostgreSQL RLS"],
    featured: true,
  },
  {
    title: "Agentic RAG M&A Intelligence Engine",
    description:
      "A multi-agent RAG platform for M&A analysts that ingests pitch decks and 200+ page financial documents and answers questions with page-level citations, expanding into a 9-agent LangGraph workflow across deal sourcing and due diligence.",
    highlights: [
      "Modality-specific chunking: OCR'd narrative text and Camelot-extracted financial tables (as Markdown) embedded into Qdrant",
      "Cited, context-only answers run as durable, retryable Inngest workflows behind FastAPI",
      "Agent layer targeting ~65% faster document turnaround and 3× analyst throughput, with hybrid dense + BM25 retrieval next",
    ],
    stack: ["LangGraph", "FastAPI", "Inngest", "Qdrant", "LlamaIndex", "OpenAI", "Camelot"],
    repo: gh("Agentic_RAG_for_Merger_and_Acquistion_Firms"),
    featured: true,
  },
  {
    title: "Production-Grade Agentic RAG Research Assistant",
    description:
      "An agentic research assistant for AI papers, built production-style: a 12-service Docker Compose stack with daily arXiv ingestion, a FastAPI service and LLM observability, growing into hybrid search and an agentic answer pipeline.",
    highlights: [
      "Daily Airflow DAG pulls the newest arXiv papers with rate limiting and a retrying PDF cache",
      "Typed pydantic-settings config and a multi-stage uv Docker image; OpenSearch, Ollama and Langfuse wired in",
      "Hybrid BM25 + vector search and a LangGraph agent (retrieve, grade, rewrite, answer) on the roadmap",
    ],
    stack: ["FastAPI", "Airflow", "OpenSearch", "Ollama", "Langfuse", "Docker Compose"],
    repo: gh("Production_Grade_Agentic_RAG_Research_Assistant"),
    featured: true,
  },
  {
    title: "RAG Financial News Research Assistant",
    description:
      "A research tool for financial and stock-market news: paste article URLs, then ask questions and get answers with the source URLs cited.",
    highlights: [
      "Article ingestion with LangChain's UnstructuredURLLoader",
      "OpenAI embeddings indexed in FAISS for fast similarity search",
      "Streamlit interface returning grounded answers alongside their sources",
    ],
    stack: ["LangChain", "OpenAI", "FAISS", "Streamlit", "Python"],
    repo: gh("RAG-Powered-Financial-News-Research-Assistant"),
    featured: true,
  },
  {
    title: "RAG Q&A Assistant over a Knowledge Base",
    description:
      "A retrieval-augmented question-answering system over an e-learning company's real FAQ data, so learners get answers in seconds instead of waiting on support staff.",
    highlights: [
      "Hugging Face instructor embeddings with a FAISS vector store",
      "LangChain retrieval chain on Google PaLM, answering only from the knowledge base",
      "Streamlit UI with one-click knowledge-base rebuild",
    ],
    stack: ["LangChain", "Google PaLM", "Hugging Face", "FAISS", "Streamlit"],
    repo: gh("RAG-based-Natural-language-to-SQL-query-tool"),
    featured: true,
  },
  {
    title: "GPT from Scratch",
    description:
      "Implementing the decoder-only transformer from “Attention Is All You Need” from first principles: self-attention, multi-head attention and training loop.",
    stack: ["PyTorch", "Transformers"],
    repo: gh("GPT-from-Scratch-"),
  },
  {
    title: "Weather ETL Pipeline",
    description:
      "A scheduled Airflow pipeline, built on Astronomer's Astro runtime, that pulls weather data from the Open-Meteo API every day, transforms it and loads it into PostgreSQL.",
    highlights: [
      "Daily DAG written with the TaskFlow API, split into extract, transform and load tasks",
      "HttpHook for the API call and PostgresHook for loading, with credentials kept in Airflow connections",
      "Runs as a containerised Airflow stack via the Astro CLI, with connections defined as code",
    ],
    stack: ["Apache Airflow", "Astro", "PostgreSQL", "Docker", "Python"],
    repo: gh("ETL_pipeline_using_Apache_Airflow_Astro_PostgreSQL"),
    featured: true,
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages & Backend", items: ["Python", "JavaScript", "Kotlin", "FastAPI", "Django", "Celery", "Kafka", "Redis"] },
  { group: "GenAI & LLMs", items: ["LangChain", "LangGraph", "LlamaIndex", "Hugging Face", "AWS Bedrock", "Azure AI Foundry"] },
  { group: "Machine Learning", items: ["PyTorch", "TensorFlow", "Keras", "scikit-learn", "PySpark", "MLflow", "YOLO"] },
  { group: "Data & Vector Stores", items: ["PostgreSQL", "MongoDB", "Weaviate", "Qdrant", "Pinecone", "ChromaDB", "FAISS", "OpenSearch", "pgvector"] },
  {
    group: "Azure",
    items: ["Durable Functions", "Container Apps", "AI Foundry", "Database for PostgreSQL", "Blob Storage", "Key Vault", "Entra ID", "Static Web Apps", "Application Insights", "Microsoft Graph"],
  },
  { group: "AWS & GCP", items: ["EC2", "S3", "EKS", "SageMaker", "Lambda", "Bedrock", "GCP Cloud Run", "Artifact Registry"] },
  { group: "DevOps", items: ["Docker", "Kubernetes", "Helm", "ArgoCD", "Terraform", "GitHub Actions", "Prometheus", "Grafana", "Playwright"] },
];

export const education = [
  {
    school: "University of Sydney",
    degree: "Master of Science in Computer Science (Data Science & AI)",
    detail: "WAM 86.8",
    period: "Feb 2026 – Feb 2028",
  },
  {
    school: "Easwari Engineering College",
    degree: "Bachelor of Engineering, Electronics & Communication",
    detail: "CGPA 8.06",
    period: "Graduated Jun 2025",
  },
];
