'use client';

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ExternalLink,
  FileCheck2,
  FilePlus2,
  FileText,
  Languages,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useRef, useState } from 'react';

type Stage = 'ready' | 'scanning' | 'results';

type AuditFinding = {
  severity: string;
  title: string;
  summary: string;
  action: string;
  evidence: string;
  tone: 'danger' | 'warning';
  icon: 'identity' | 'calendar' | 'file';
};

type AuditResult = {
  score: number;
  deadline: string;
  findings: AuditFinding[];
  passedChecks: string[];
  checksWithoutAction: number;
};

const starterDocuments = [
  {
    name: 'Scholarship guidelines.pdf',
    meta: 'Official notice · 12 pages',
    kind: 'rule',
  },
  { name: 'Aadhaar card.pdf', meta: 'Identity document', kind: 'identity' },
  {
    name: 'Income certificate.pdf',
    meta: 'Issued 14 months ago',
    kind: 'document',
  },
  {
    name: 'Class XII marksheet.pdf',
    meta: 'Academic record',
    kind: 'document',
  },
];

function StatusBadge({ tone, children }: { tone: string; children: React.ReactNode }) {
  const palette =
    tone === 'danger'
      ? 'border-rose-200 bg-rose-50 text-rose-700'
      : 'border-amber-200 bg-amber-50 text-amber-800';
  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.09em] ${palette}`}>
      {children}
    </span>
  );
}

export default function Home() {
  const [stage, setStage] = useState<Stage>('ready');
  const [documents, setDocuments] = useState(starterDocuments);
  const [openFinding, setOpenFinding] = useState<number | null>(0);
  const [language, setLanguage] = useState('English');
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [auditError, setAuditError] = useState('');
  const [planCreated, setPlanCreated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isHindi = language === 'हिन्दी';

  async function runAudit() {
    setAuditError('');
    setStage('scanning');
    const minimumDelay = new Promise((resolve) => window.setTimeout(resolve, 850));

    try {
      const responsePromise = fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentNames: documents.map((document) => document.name) }),
      });
      const [response] = await Promise.all([responsePromise, minimumDelay]);
      const data = (await response.json()) as AuditResult & { error?: string };
      if (!response.ok) throw new Error(data.error || 'Audit failed.');
      setAudit(data);
      setStage('results');
    } catch (error) {
      setAuditError(error instanceof Error ? error.message : 'Audit failed. Please try again.');
      setStage('ready');
    }
  }

  function addDocument(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setDocuments((current) => [
      ...current,
      { name: file.name, meta: 'Added from this device', kind: 'document' },
    ]);
    event.target.value = '';
  }

  function resetAudit() {
    setStage('ready');
    setOpenFinding(0);
    setAuditError('');
    setPlanCreated(false);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1380px] items-center justify-between px-5 lg:px-8">
          <button type="button" onClick={resetAudit} className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="size-5" strokeWidth={2.2} />
            </span>
            <span>
              <span className="block font-heading text-[17px] font-bold leading-none tracking-tight">ScholarSure</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Application audit</span>
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setLanguage((value) => (value === 'English' ? 'हिन्दी' : 'English'))}
              className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold transition hover:border-primary/40 sm:flex"
              aria-label="Switch interface language"
            >
              <Languages className="size-3.5" />
              {language}
            </button>
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
              <LockKeyhole className="size-3.5" />
              <span className="hidden sm:inline">Private demo</span>
              <span className="sm:hidden">Private</span>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1380px] px-5 py-7 lg:px-8 lg:py-10">
        <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <Sparkles className="size-4" />
              AI pre-submission check
            </div>
            <h1 className="max-w-3xl font-heading text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
              {isHindi
                ? 'उन छोटी गलतियों को खोजें जिनकी वजह से छात्रवृत्ति छूट सकती है।'
                : 'Find the small mistakes that can cost a scholarship.'}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {isHindi
                ? 'आधिकारिक नियमों और छात्र के दस्तावेज़ों की तुलना करें, फिर हर समस्या को स्पष्ट अगले कदम में बदलें।'
                : 'Compare official rules with a student’s documents and turn every issue into a clear next step.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:gap-3 sm:text-sm">
            <div className="grid size-8 place-items-center rounded-full bg-secondary font-bold text-secondary-foreground sm:size-9">1</div>
            <span className={stage !== 'results' ? 'font-semibold text-foreground' : ''}>Add documents</span>
            <span className="h-px w-5 bg-border sm:w-8" />
            <div className={`grid size-8 place-items-center rounded-full border font-bold sm:size-9 ${stage === 'results' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'}`}>2</div>
            <span className={stage === 'results' ? 'font-semibold text-foreground' : ''}>Review audit</span>
          </div>
        </div>

        <div className="grid overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_24px_80px_-48px_rgba(25,40,50,0.35)] lg:grid-cols-[0.82fr_1.18fr]">
          <section className="border-b border-border bg-[#f4f7f3] p-5 sm:p-7 lg:border-b-0 lg:border-r">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Student file</p>
                <h2 className="mt-1 font-heading text-xl font-bold">Aarav’s application</h2>
                <p className="mt-1 text-xs text-muted-foreground">PM-USP CSSS · Demo scenario</p>
              </div>
              <span className="shrink-0 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold">
                {documents.length} files
              </span>
            </div>

            <div className="space-y-3">
              {documents.map((document, index) => (
                <div key={`${document.name}-${index}`} className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3.5 shadow-[0_6px_16px_-14px_rgba(25,40,50,0.4)]">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${document.kind === 'rule' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                    {document.kind === 'rule' ? <FileCheck2 className="size-5" /> : <FileText className="size-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{document.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{document.meta}</p>
                  </div>
                  <Check className="size-4 shrink-0 text-emerald-600" />
                </div>
              ))}
            </div>

            <input ref={fileInputRef} onChange={addDocument} className="sr-only" type="file" accept=".pdf,.png,.jpg,.jpeg" aria-label="Choose a document to add" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/[0.04] px-4 py-4 text-sm font-bold text-primary transition hover:bg-primary/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FilePlus2 className="size-4" />
              Add another document
            </button>

            <div className="mt-5 rounded-2xl border border-border/80 bg-white/65 p-4 text-xs leading-5 text-muted-foreground">
              <div className="mb-1.5 flex items-center gap-2 font-bold text-foreground">
                <LockKeyhole className="size-3.5 text-primary" />
                Privacy note
              </div>
              Uploaded files remain in this browser. This prototype uses sample audit results and never submits an application.
            </div>
          </section>

          {stage === 'ready' && (
            <section className="flex min-h-[560px] flex-col items-center justify-center p-6 text-center sm:p-10">
              <span className="grid size-16 place-items-center rounded-[22px] bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Sparkles className="size-7" />
              </span>
              <h2 className="mt-6 font-heading text-2xl font-bold tracking-tight">
                {isHindi ? '12-बिंदु जाँच के लिए तैयार' : 'Ready for a 12-point audit'}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                {isHindi
                  ? 'पहचान की समानता, दस्तावेज़ की वैधता, पात्रता प्रमाण और आवेदन आवश्यकताओं की जाँच करें।'
                  : 'Check identity consistency, document validity, eligibility evidence, and submission requirements.'}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['Name matching', 'Document freshness', 'Mandatory OTR'].map((item) => (
                  <span key={item} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">{item}</span>
                ))}
              </div>
              <button
                type="button"
                onClick={runAudit}
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {isHindi ? 'आवेदन जाँच शुरू करें' : 'Run application audit'}
                <ArrowRight className="size-4" />
              </button>
              <p className="mt-4 text-xs text-muted-foreground">Uses a preloaded demo scenario · Takes about a second</p>
              {auditError && <p className="mt-3 text-xs font-semibold text-rose-600">{auditError}</p>}
            </section>
          )}

          {stage === 'scanning' && (
            <section className="flex min-h-[560px] flex-col items-center justify-center p-8 text-center" aria-live="polite">
              <span className="relative grid size-20 place-items-center rounded-[26px] bg-primary/10 text-primary">
                <LoaderCircle className="size-9 animate-spin" />
                <span className="absolute -right-1 -top-1 size-4 animate-pulse rounded-full border-4 border-white bg-amber-400" />
              </span>
              <h2 className="mt-7 font-heading text-2xl font-bold">Comparing 12 requirements…</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Reading the official notice, matching fields, and checking document dates.</p>
              <div className="mt-8 h-2 w-full max-w-sm overflow-hidden rounded-full bg-secondary">
                <span className="block h-full w-3/4 animate-pulse rounded-full bg-primary" />
              </div>
            </section>
          )}

          {stage === 'results' && audit && (
            <section className="min-h-[560px] p-5 sm:p-7" aria-live="polite">
              <div className="mb-5 flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="grid size-16 shrink-0 place-items-center rounded-[20px] bg-amber-50 text-amber-800 ring-1 ring-amber-200">
                    <div className="text-center">
                      <span className="block text-2xl font-black leading-none">{audit.score}</span>
                      <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-wider">score</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-amber-700">Needs attention</p>
                    <h2 className="mt-1 font-heading text-2xl font-bold">{audit.findings.length} actions before submission</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{audit.passedChecks.length} checks passed · {audit.checksWithoutAction} checks need no action</p>
                  </div>
                </div>
                <button type="button" onClick={resetAudit} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs font-bold transition hover:border-primary/40">
                  <RotateCcw className="size-3.5" />
                  Run again
                </button>
              </div>

              <div className="space-y-3">
                {audit.findings.map((finding, index) => {
                  const Icon = finding.icon === 'identity' ? CircleAlert : finding.icon === 'calendar' ? CalendarClock : FilePlus2;
                  const isOpen = openFinding === index;
                  return (
                    <article key={finding.title} className={`overflow-hidden rounded-2xl border bg-white ${finding.tone === 'danger' ? 'border-rose-200' : 'border-amber-200'}`}>
                      <button
                        type="button"
                        onClick={() => setOpenFinding(isOpen ? null : index)}
                        className="flex w-full items-start gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                        aria-expanded={isOpen}
                      >
                        <span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${finding.tone === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'}`}>
                          <Icon className="size-4.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-extrabold">{finding.title}</span>
                            <StatusBadge tone={finding.tone}>{finding.severity}</StatusBadge>
                          </span>
                          <span className="mt-1.5 block text-xs leading-5 text-muted-foreground">{finding.summary}</span>
                        </span>
                        <ChevronDown className={`mt-1 size-4 shrink-0 text-muted-foreground transition ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="border-t border-inherit bg-[#fbfcfa] px-4 pb-4 pt-3 sm:pl-16">
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Recommended action</p>
                          <p className="mt-1 text-sm font-semibold leading-5">{finding.action}</p>
                          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                            Source location
                            <ExternalLink className="size-3" />
                          </div>
                          <p className="mt-1 text-[11px] text-muted-foreground">{finding.evidence}</p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              <details className="group mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-extrabold text-emerald-900">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                  {audit.passedChecks.length} checks passed
                  <ChevronDown className="ml-auto size-4 transition group-open:rotate-180" />
                </summary>
                <ul className="mt-3 space-y-2 border-t border-emerald-200 pt-3">
                  {audit.passedChecks.map((check) => (
                    <li key={check} className="flex items-start gap-2 text-xs leading-5 text-emerald-900/80">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                      {check}
                    </li>
                  ))}
                </ul>
              </details>

              <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-foreground p-4 text-background sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-300" />
                  <div>
                    <p className="text-sm font-bold">Next deadline: {audit.deadline}</p>
                    <p className="mt-0.5 text-xs text-background/65">Resolve critical issues before starting the official form.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPlanCreated(true)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-background px-4 py-2.5 text-xs font-extrabold text-foreground transition hover:bg-white"
                >
                  {planCreated ? 'Plan created' : 'Create action plan'}
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              {planCreated && (
                <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/[0.04] p-4" aria-live="polite">
                  <div className="flex items-center gap-2 text-sm font-extrabold">
                    <CheckCircle2 className="size-4.5 text-primary" />
                    Aarav’s recovery plan
                  </div>
                  <ol className="mt-3 grid gap-2 sm:grid-cols-3">
                    {[
                      ['Today', 'Start OTR registration'],
                      ['This week', 'Request fresh income certificate'],
                      ['Before submission', 'Resolve the name mismatch'],
                    ].map(([when, task], index) => (
                      <li key={task} className="rounded-xl border border-border bg-white p-3">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-primary">{index + 1} · {when}</p>
                        <p className="mt-1 text-xs font-bold leading-5">{task}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </section>
          )}
        </div>

        <footer className="flex flex-col items-center justify-between gap-3 py-6 text-center text-[11px] text-muted-foreground sm:flex-row sm:text-left">
          <p>Hackathon prototype · Results are illustrative and must be verified against official rules.</p>
          <button type="button" onClick={runAudit} className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline">
            <ArrowLeft className="size-3" />
            Skip to sample results
          </button>
        </footer>
      </section>
    </main>
  );
}
