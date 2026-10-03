import { Link } from 'react-router-dom'
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiCheck,
  FiCpu,
  FiDatabase,
  FiHeart,
  FiMessageSquare,
  FiSearch,
  FiShield,
  FiUsers,
} from 'react-icons/fi'

const capabilities = [
  {
    icon: FiMessageSquare,
    title: 'Interaction management',
    text: 'Capture meeting details, discussion topics, materials, samples, sentiment, outcomes, and follow-up actions in structured records.',
  },
  {
    icon: FiCpu,
    title: 'AI-assisted drafting',
    text: 'Use a LangGraph-powered assistant to create or amend an interaction draft from natural-language instructions. Review the returned changes before using them.',
  },
  {
    icon: FiSearch,
    title: 'HCP context and history',
    text: 'Search for healthcare professionals, view their profile and engagement history, and explore sentiment trends over time.',
  },
  {
    icon: FiBarChart2,
    title: 'Team insights',
    text: 'Role-aware dashboards summarize activity, sentiment, material and sample usage, and follow-up attention items.',
  },
]

const technologies = [
  ['Application', 'React, Vite, Redux Toolkit'],
  ['API', 'FastAPI, SQLAlchemy, Pydantic'],
  ['Data', 'PostgreSQL with pgvector'],
  ['AI', 'LangGraph, LangChain, Groq'],
  ['Semantic search', 'OpenAI embeddings (optional configuration)'],
  ['Authentication', 'JWT-based sign-in and role-aware access'],
]

export default function AboutPage() {
  return (
    <div className="h-screen overflow-y-auto bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="HCP CRM home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <FiHeart size={19} />
            </span>
            <span>
              <span className="block text-base font-extrabold tracking-tight">HCP CRM</span>
              <span className="block text-[11px] font-medium text-slate-500">Healthcare engagement workspace</span>
            </span>
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            <Link to="/" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">Home</Link>
            <Link to="/services" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">Services</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex">Sign in</Link>
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
              Get started <FiArrowRight size={15} />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-slate-950">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_10%,rgba(37,99,235,0.3),transparent_42%),radial-gradient(ellipse_at_10%_100%,rgba(14,165,233,0.15),transparent_38%)]" />
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3.5 py-2 text-xs font-semibold text-blue-200">
                <FiHeart size={14} /> About the platform
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Make healthcare engagement easier to understand and act on.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                HCP CRM is an AI-assisted workspace for organizing healthcare professional relationships—from profile research and conversation notes to team insights and follow-up.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-400">
                  Explore the workspace <FiArrowRight size={15} />
                </Link>
                <Link to="/services" className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  View capabilities
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Why HCP CRM</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">A more connected view of every relationship.</h2>
            </div>
            <div className="space-y-5 text-base leading-7 text-slate-600">
              <p>
                Important details can be scattered across notes, conversations, and separate records. HCP CRM brings professional profiles and interaction history into a shared workflow, so users can spend less time piecing together context.
              </p>
              <p>
                The platform is designed to help representatives capture the substance of an interaction and help managers see engagement patterns across their team. AI can assist with drafting and finding related notes, while people remain responsible for reviewing and finalizing information.
              </p>
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 text-sm leading-6 text-blue-950">
                <div className="mb-2 flex items-center gap-2 font-bold"><FiShield size={16} /> Built for organized engagement</div>
                HCP CRM provides relationship-management and reporting tools. It does not claim regulatory certification or replace your organization’s compliance, privacy, or record-retention requirements.
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">What you can do</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Purpose-built capabilities for the engagement workflow.</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {capabilities.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={20} /></span>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">How it fits together</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">From a conversation to a useful record.</h2>
              <div className="mt-8 space-y-5">
                {[
                  ['Find', 'Look up an HCP and review their profile and past interactions.'],
                  ['Capture', 'Create an interaction draft with structured details or a natural-language note.'],
                  ['Refine', 'Use AI assistance to propose field updates, then review the information.'],
                  ['Learn', 'Return to the interaction history and use dashboards to understand engagement.'],
                ].map(([title, text], index) => (
                  <div key={title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{index + 1}</span>
                    <div>
                      <h3 className="font-bold text-slate-900">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><FiDatabase size={20} /></span>
                <div>
                  <h3 className="font-bold text-slate-900">A modern application stack</h3>
                  <p className="mt-1 text-xs text-slate-500">Built to connect structured records and AI assistance</p>
                </div>
              </div>
              <div className="mt-6 divide-y divide-slate-100">
                {technologies.map(([area, tool]) => (
                  <div key={area} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-semibold text-slate-700">{area}</span>
                    <span className="text-sm text-slate-500 sm:text-right">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Designed for teams</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Shared visibility with role-aware access.</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">HCP CRM includes account roles that shape the experience and the information available in the application.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300"><FiUsers size={19} /></span>
                <h3 className="mt-4 font-bold text-white">Representatives</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Create and review their interaction records and work with HCP profiles.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300"><FiActivity size={19} /></span>
                <h3 className="mt-4 font-bold text-white">Managers</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Review team activity and aggregate engagement through manager views.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[2rem] bg-blue-50 p-8 sm:p-10 md:flex-row md:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700"><FiCheck size={14} /> Start with better context</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">See how HCP CRM supports your workflow.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Explore the application or learn more about its capabilities.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                Get started <FiArrowRight size={15} />
              </Link>
              <Link to="/contact" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700">
                Contact
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link to="/" className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white"><FiHeart size={15} /></span>
            HCP CRM
          </Link>
          <div className="flex gap-5 text-sm font-medium text-slate-500">
            <Link to="/" className="transition hover:text-blue-700">Home</Link>
            <Link to="/services" className="transition hover:text-blue-700">Services</Link>
            <Link to="/contact" className="transition hover:text-blue-700">Contact</Link>
          </div>
          <span className="text-xs text-slate-400">Healthcare engagement workspace</span>
        </div>
      </footer>
    </div>
  )
}
