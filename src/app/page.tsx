import { education, experience, profile, projects, skills } from "@/data/portfolio";
import { existsSync } from "node:fs";
import path from "node:path";
import { ArrowUpRightIcon, DownloadIcon, GitHubIcon, LinkedInIcon } from "@/components/icons";
import { LiveClock } from "@/components/live-clock";
import { Typewriter } from "@/components/typewriter";
import { Terminal, type TerminalStep } from "@/components/terminal";
import { Dock } from "@/components/dock";
import { RippleField } from "@/components/ripple-field";
import { TimelineProgress } from "@/components/timeline-progress";
import { ScrollRail } from "@/components/scroll-rail";
import { MusicToggle } from "@/components/music-toggle";
import { IntroLoader } from "@/components/intro-loader";

const railStops = [
  { id: "top", label: "Intro" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-xs text-muted">
      {children}
    </span>
  );
}

function Section({ id, index, title, children }: { id: string; index: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-t border-border py-24">
      <div className="reveal grid gap-8 md:grid-cols-[200px_1fr]">
        <h2 className="font-mono text-sm uppercase tracking-widest">
          <span className="text-subtle">{index} /</span> <span className="text-accent">{title}</span>
        </h2>
        <div>{children}</div>
      </div>
    </section>
  );
}

const btnGhost =
  "inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-2.5 text-sm font-medium backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent";

// Resolved at build time: shows the photo if public/profile.jpg exists, initials otherwise.
const hasPhoto = existsSync(path.join(process.cwd(), "public", profile.avatar));
// Drop a track at public/music/ambient.mp3 to show the music toggle.
const MUSIC_SRC = "/music/ambient.mp3";
const hasMusic = existsSync(path.join(process.cwd(), "public", MUSIC_SRC));

const terminalSteps: TerminalStep[] = [
  { cmd: "whoami", out: [`${profile.name.toLowerCase()} · ai/llm engineer · sydney`] },
  { cmd: "cat now.txt", out: profile.now.map((n) => `→ ${n.label.toLowerCase()} @ ${n.detail.toLowerCase()}`) },
  { cmd: "valeon-engine --status", out: ["5 supervisors · 65 sub-agents · 79 tables", "azure durable functions ✓  pgvector ✓  rls ✓"] },
  { cmd: "echo $COFFEE_LEVEL", out: ["critically low. send help (or a job offer)."] },
];

const marqueeItems = skills.flatMap((s) => s.items);

export default function Home() {
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      <IntroLoader initials={profile.initials} musicSrc={hasMusic ? MUSIC_SRC : undefined} />
      <div id="site">
      {/* Page-wide background: drifting glows + cursor ripple field, fixed behind every section */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        {/* Radial gradients (not filter: blur) so the glow always fades to transparent with no hard edges */}
        <div className="animate-drift absolute -left-[20vw] -top-[25vh] h-[110vh] w-[75vw] bg-[radial-gradient(closest-side,var(--accent-soft),transparent)] opacity-90" />
        <div className="animate-drift absolute -right-[20vw] top-[5vh] h-[100vh] w-[65vw] bg-[radial-gradient(closest-side,var(--glow-2),transparent)] opacity-90 [animation-delay:-9s]" />
        <div className="animate-drift absolute -bottom-[35vh] left-[15vw] h-[90vh] w-[70vw] bg-[radial-gradient(closest-side,var(--accent-soft),transparent)] opacity-50 [animation-delay:-5s]" />
        <RippleField />
      </div>

      <header className="sticky top-0 z-10 border-b border-border/60 bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 font-mono text-xs sm:px-6">
          <a href="#top" className="font-sans text-sm font-semibold tracking-tight sm:text-base">
            Arjun <span className="text-accent">Mageswaran</span>
          </a>
          <p className="flex items-center gap-2 text-muted">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            <span className="hidden sm:inline">Sydney, AU ·</span> <LiveClock />
          </p>
          <div className="flex items-center gap-4">
            {hasMusic && <MusicToggle src={MUSIC_SRC} />}
            <a href={profile.linkedin} target="_blank" rel="noopener" className="hidden text-muted transition-colors hover:text-accent sm:inline">
              say hi ↗
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <section className="relative isolate grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.15fr_1fr]">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 -top-24 -z-10 h-[900px] w-screen -translate-x-1/2 [mask-image:linear-gradient(black_50%,transparent)]">
            <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_40%_35%,black,transparent_75%)]" />
          </div>

          <div>
            <div className="flex items-center gap-4">
              {hasPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  width={72}
                  height={72}
                  className="size-[72px] rounded-full object-cover ring-2 ring-accent ring-offset-4 ring-offset-bg"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex size-[72px] items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-mono text-xl font-semibold text-bg ring-2 ring-accent/40 ring-offset-4 ring-offset-bg"
                >
                  {profile.initials}
                </div>
              )}
              <p className="font-mono text-sm text-muted">
                <span className="text-accent">{profile.role}</span>
                <br />
                {profile.location}
              </p>
            </div>

            <h1 className="mt-8 text-[clamp(2.5rem,12.5vw,3rem)] font-semibold leading-[1.02] tracking-tight sm:text-7xl">
              {profile.name.split(" ")[0]}{" "}
              <span className="bg-gradient-to-r from-accent via-accent-2 to-accent bg-[length:200%_auto] bg-clip-text text-transparent">
                {profile.name.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            <p className="mt-6 min-h-[1.75em] font-mono text-base text-fg sm:text-lg">
              <span className="text-subtle">currently building </span>
              <span className="text-accent">
                <Typewriter phrases={profile.building} />
              </span>
            </p>

            <div className="mt-8 max-w-xl space-y-4 leading-relaxed text-muted sm:text-lg">
              {profile.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={profile.resume}
                download
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-medium text-bg shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-accent/40"
              >
                <DownloadIcon /> Download resume
              </a>
              <a href={profile.github} target="_blank" rel="noopener" className={btnGhost}>
                <GitHubIcon /> GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener" className={btnGhost}>
                <LinkedInIcon /> LinkedIn
              </a>
            </div>
          </div>

          <Terminal steps={terminalSteps} />
        </section>

        {/* Tech marquee */}
        <div
          aria-hidden="true"
          className="group relative -mx-4 overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] sm:-mx-6"
        >
          <div className="animate-marquee flex w-max gap-3 group-hover:[animation-play-state:paused]">
            {[...marqueeItems, ...marqueeItems].map((s, i) => (
              <span key={i} className="whitespace-nowrap rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted">
                {s}
              </span>
            ))}
          </div>
        </div>

        <Section id="skills" index="01" title="Skills">
          <dl className="grid gap-4 sm:grid-cols-2">
            {skills.map((s) => (
              <div key={s.group} className="glow-card rounded-2xl border border-border bg-surface p-5">
                <dt className="font-medium">{s.group}</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {s.items.map((i) => (
                    <Tag key={i}>{i}</Tag>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="about" index="02" title="About">
          <div className="space-y-4 text-lg leading-relaxed text-muted">
            {profile.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {education.map((e) => (
              <li key={e.school} className="glow-card rounded-2xl border border-border bg-surface p-5">
                <p className="font-medium">{e.school}</p>
                <p className="mt-1 text-sm text-muted">{e.degree}</p>
                <p className="mt-3 flex justify-between font-mono text-xs text-subtle">
                  <span>{e.detail}</span>
                  <span>{e.period}</span>
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="experience" index="03" title="Experience">
          <div className="relative">
            <TimelineProgress />
          <ol className="relative space-y-14 border-l border-border pl-8">
            {experience.map((job) => (
              <li key={job.company} className="group/item relative">
                <span className="absolute -left-[39px] top-1.5 flex size-3.5 items-center justify-center rounded-full bg-bg ring-2 ring-border transition-all duration-300 group-data-[reached=true]/item:ring-accent">
                  <span className="size-1.5 rounded-full bg-subtle transition-colors duration-300 group-data-[reached=true]/item:bg-accent" />
                </span>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-xl font-semibold">
                    {job.role} <span className="text-accent">@ {job.company}</span>
                  </h3>
                  <p className="font-mono text-sm text-subtle">
                    {job.period} · {job.location}
                  </p>
                </div>
                <ul className="mt-5 space-y-3 text-muted">
                  {job.points.map((pt) => (
                    <li key={pt} className="relative pl-5 leading-relaxed before:absolute before:left-0 before:top-0 before:font-mono before:text-accent before:content-['›']">
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {job.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          </div>
        </Section>

        <Section id="projects" index="04" title="Projects">
          <div className="space-y-6">
            {featured.map((p, i) => (
              <article key={p.title} className="glow-card group rounded-2xl border border-border bg-surface p-6 transition-transform hover:-translate-y-1 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold">
                    <span className="mr-3 font-mono text-sm text-subtle">{String(i + 1).padStart(2, "0")}</span>
                    {p.title}
                  </h3>
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noopener"
                      aria-label={`${p.title} on GitHub`}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      <GitHubIcon /> Code
                    </a>
                  )}
                </div>
                <p className="mt-3 leading-relaxed text-muted">{p.description}</p>
                {p.highlights && (
                  <ul className="mt-4 space-y-2 text-sm text-muted">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <a
            href={`${profile.github}?tab=repositories`}
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            All repositories on GitHub <ArrowUpRightIcon />
          </a>
        </Section>

        <Section id="contact" index="05" title="Contact">
          <p className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Got a hard retrieval problem or an agent that keeps{" "}
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">falling over?</span>
          </p>
          <p className="mt-6 max-w-xl text-lg text-muted">
            I&apos;m open to AI/LLM engineering roles. The fastest way to reach me is a message on LinkedIn.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-medium text-bg shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-accent/40"
            >
              <LinkedInIcon /> Message me on LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noopener" className={btnGhost}>
              <GitHubIcon /> github.com/Amg1703
            </a>
            <a href={profile.resume} download className={btnGhost}>
              <DownloadIcon /> Resume (PDF)
            </a>
          </div>
        </Section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 pb-32 pt-8 font-mono text-xs text-subtle sm:px-6">
          <span>© 2026 {profile.name}</span>
          <span>
            Sydney time: <LiveClock />
          </span>
        </div>
      </footer>

      <ScrollRail stops={railStops} />
      <Dock resume={profile.resume} />
      </div>
    </>
  );
}
