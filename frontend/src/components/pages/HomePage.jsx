import { Link } from 'react-router-dom'
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiCheck,
  FiChevronRight,
  FiCpu,
  FiHeart,
  FiMessageSquare,
  FiSearch,
  FiUsers,
  FiZap,
} from 'react-icons/fi'

const features = [
  {
    icon: FiMessageSquare,
    title: 'Capture every interaction',
    text: 'Record meetings, calls, topics, materials, sentiment, outcomes, and follow-up actions in one structured place.',
    color: 'blue',
  },
  {
    icon: FiCpu,
    title: 'Let AI help with the notes',
    text: 'Describe an interaction naturally and use the LangGraph assistant to draft or amend its fields.',
    color: 'violet',
  },
  {
    icon: FiSearch,
    title: 'Find the right context',
    text: 'Search HCP profiles and interaction history, including semantically similar notes when embeddings are configured.',
    color: 'cyan',
  },
  {
    icon: FiBarChart2,
    title: 'Understand engagement',
    text: 'Review activity and sentiment trends with role-aware dashboards and reports.',
    color: 'amber',
  },
]

const workflow = [
  ['01', 'Find an HCP', 'Search the directory and review their profile and interaction history.'],
  ['02', 'Capture the conversation', 'Log the meeting details directly or start with a natural-language note.'],
  ['03', 'Review and follow up', 'Keep outcomes and next steps alongside the interaction record.'],
]

export default function HomePage() {
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

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">Features</a>
            <a href="#workflow" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">How it works</a>
            <Link to="/about" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">About</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex">
              Sign in
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
              Get started <FiArrowRight size={15} />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-slate-950">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_15%,rgba(37,99,235,0.32),transparent_42%),radial-gradient(ellipse_at_5%_90%,rgba(14,165,233,0.18),transparent_38%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.03fr_0.97fr] lg:gap-16 lg:py-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3.5 py-2 text-xs font-semibold text-blue-200">
                <FiZap size={14} />
                Built for thoughtful HCP engagement
              </div>
              <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[58px]">
                Better context for every healthcare conversation.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                HCP CRM brings interaction logging, professional profiles, AI-assisted notes, and engagement insights into one focused workspace.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-950/40 transition hover:bg-blue-400">
                  Create your account <FiArrowRight size={16} />
                </Link>
                <Link to="/about" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                  Explore the platform <FiChevronRight size={16} />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-400">
                <span className="inline-flex items-center gap-2"><FiCheck className="text-emerald-400" /> Structured interaction history</span>
                <span className="inline-flex items-center gap-2"><FiCheck className="text-emerald-400" /> AI-assisted drafting</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-blue-500/15 blur-3xl" />
              <div className="relative rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-4 shadow-2xl shadow-black/40 sm:p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300"><FiActivity size={17} /></span>
                    <div>
                      <p className="text-sm font-semibold text-white">Interaction workspace</p>
                      <p className="mt-0.5 text-xs text-slate-400">A clearer view of each conversation</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">Draft</span>
                </div>
                <div className="space-y-3 py-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">HCP profile</p>
                        <p className="mt-1 text-sm font-semibold text-white">Professional and interaction context</p>
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300"><FiUsers size={15} /></span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <span className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-[11px] text-slate-300">Profile</span>
                      <span className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-[11px] text-slate-300">History</span>
                      <span className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-[11px] text-slate-300">Sentiment</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-blue-300/15 bg-blue-500/[0.08] p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
                      <FiCpu size={14} /> AI assistant
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Turn a conversation summary into a structured interaction draft, then review and refine the fields.
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-blue-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Your notes stay reviewable before saving
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs text-slate-500">One workspace for relationships and follow-through</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-slate-300"><FiChevronRight size={15} /></span>
                </div>
              </div>
              <div className="absolute -right-3 top-10 hidden items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-200 shadow-xl sm:flex">
                <FiSearch className="text-cyan-300" /> HCP search & history
              </div>
              <div className="absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-200 shadow-xl sm:flex">
                <FiBarChart2 className="text-amber-300" /> Engagement insights
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">One connected workspace</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">From HCP context to meaningful follow-up</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">Keep the details of each engagement organized, searchable, and useful to your next conversation.</p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, text, color }) => (
                <article key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    color === 'violet' ? 'bg-violet-50 text-violet-600' :
                    color === 'cyan' ? 'bg-cyan-50 text-cyan-700' :
                    color === 'amber' ? 'bg-amber-50 text-amber-700' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="scroll-mt-24 bg-slate-50 px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">A practical workflow</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Spend less time reconstructing the details.</h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">Keep HCP information, conversation notes, and next steps connected from the first lookup through the follow-up.</p>
              <Link to="/services" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-900">
                See platform capabilities <FiArrowRight size={15} />
              </Link>
            </div>
            <div className="space-y-3">
              {workflow.map(([number, title, text]) => (
                <div key={number} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">{number}</span>
                  <div>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-700 to-indigo-800 p-8 shadow-2xl shadow-blue-900/15 sm:p-12 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
                <FiHeart size={13} /> Designed around better context
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Make every interaction easier to build on.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">Explore the workspace and see how profiles, AI-assisted logging, and engagement insights fit together.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
                Get started <FiArrowRight size={15} />
              </Link>
              <Link to="/about" className="inline-flex items-center rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                About HCP CRM
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
          <div className="flex flex-wrap justify-center gap-5 text-sm font-medium text-slate-500">
            <Link to="/about" className="transition hover:text-blue-700">About</Link>
            <Link to="/services" className="transition hover:text-blue-700">Services</Link>
            <Link to="/contact" className="transition hover:text-blue-700">Contact</Link>
            <Link to="/login" className="transition hover:text-blue-700">Sign in</Link>
          </div>
          <p className="text-xs text-slate-400">HCP relationship management workspace</p>
        </div>
      </footer>
    </div>
  )
}
