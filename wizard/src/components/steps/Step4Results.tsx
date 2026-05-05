import { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useMortgageStore } from '../../store/useMortgageStore'
import { generateMortgageMix, fmt, MortgageMix } from '../../services/calculatorService'
import { validateLTV, validatePTI } from '../../services/mortgageRules'

const LOADING_MSGS = [
  'מחשב תמהיל אופטימלי...',
  'בודק כללי בנק ישראל...',
  'מנתח מסלולי ריבית...',
  'מכין את ההמלצה שלכם...',
]

// ── Loading animation ─────────────────────────────────────────────────────
function LoadingScreen() {
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setMsgIdx((i) => Math.min(i + 1, LOADING_MSGS.length - 1)), 600)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="step-enter flex flex-col items-center gap-6 px-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-line" />
        <div className="absolute inset-0 border-4 border-t-brand-500 animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🏠</div>
      </div>
      <div className="text-center">
        <div className="font-serif text-lg font-bold text-ink">{LOADING_MSGS[msgIdx]}</div>
        <div className="flex justify-center gap-1.5 mt-3">
          {LOADING_MSGS.map((_, i) => (
            <div
              key={i}
              className={[
                'w-2 h-2 transition-all duration-300',
                i <= msgIdx ? 'bg-brand-500 scale-110' : 'bg-line',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Results ───────────────────────────────────────────────────────────────
function ResultsScreen({ mix, onBack }: { mix: MortgageMix; onBack: () => void }) {
  const { propertyStatus, netMonthlyIncome, currentLoans } = useMortgageStore()
  const pti = validatePTI(netMonthlyIncome, currentLoans, mix.totalMonthlyPayment)
  const ltv = validateLTV(mix.totalLoan, useMortgageStore.getState().equity, propertyStatus ?? 'FirstHome')

  return (
    <div className="step-enter w-full max-w-2xl px-4 pb-8">

      {/* Header — dark ink with amber accent */}
      <div className="bg-ink text-white p-6 mb-6 text-center">
        <div className="text-xs font-mono tracking-[0.18em] uppercase text-brand-500/80 mb-2">
          סכום ההלוואה המשוער
        </div>
        <div className="font-serif text-5xl font-black tracking-tight text-brand-500">
          ₪{fmt(mix.totalLoan)}
        </div>
        <div className="mt-3 text-xs font-mono text-white/50 tracking-widest">
          לתקופה של {mix.termYears} שנים · החזר חודשי משוער
        </div>
        <div className="font-serif text-3xl font-bold mt-1 text-white">
          ₪{fmt(mix.totalMonthlyPayment)}/חודש
        </div>
      </div>

      {/* Compliance badges */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className={`flex items-center gap-2 px-3 py-2 text-sm font-mono ${ltv.valid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {ltv.valid ? <CheckCircle2 size={16} /> : '⚠'}
          LTV: {Math.round(ltv.actualLTV * 100)}%
          {ltv.valid ? ' — תקין' : ' — חורג'}
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 text-sm font-mono ${pti.valid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-brand-50 text-brand-700 border border-brand-200'}`}>
          {pti.valid ? <CheckCircle2 size={16} /> : '⚠'}
          PTI: {Math.round((mix.totalMonthlyPayment / Math.max(pti.availableIncome, 1)) * 100)}%
          {pti.valid ? ' — תקין' : ' — ייתכן חריג'}
        </div>
      </div>

      {/* Track mix */}
      <div className="mb-6">
        <div className="text-[10px] font-mono font-semibold text-ink/40 tracking-[0.2em] uppercase mb-3">
          תמהיל מומלץ — 3 מסלולים שווים
        </div>

        {/* Visual bar */}
        <div className="flex h-3 overflow-hidden mb-4 gap-px">
          {mix.tracks.map((t) => (
            <div key={t.name} className={`flex-1 h-full ${t.barClass}`} />
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {mix.tracks.map((t) => (
            <div
              key={t.name}
              className={`flex items-center justify-between border border-line px-4 py-3.5 ${t.bgClass}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rotate-45 flex-shrink-0 ${t.dotClass}`} />
                <div>
                  <div className="font-semibold text-sm text-ink">{t.name}</div>
                  <div className="text-xs text-ink/45 font-mono">{t.description}</div>
                </div>
              </div>
              <div className="text-left">
                <div className={`font-mono font-black text-sm ${t.textClass}`}>
                  ₪{fmt(t.monthlyPayment)}/ח׳
                </div>
                <div className="text-xs text-ink/40 font-mono">{t.annualRate.toFixed(2)}% שנתי</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary totals */}
      <div className="border border-line bg-paper p-5 mb-6 grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-[10px] font-mono text-ink/40 tracking-widest uppercase">סה"כ תשלום</div>
          <div className="font-serif text-xl font-black text-ink mt-0.5">₪{fmt(mix.totalPayment)}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-ink/40 tracking-widest uppercase">מתוכו ריבית</div>
          <div className="font-serif text-xl font-black text-brand-700 mt-0.5">₪{fmt(mix.totalInterest)}</div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-ink p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="w-2 h-2 bg-brand-500 rotate-45" />
          <div className="font-serif text-base font-bold text-white">
            רוצים להתחרות על הריביות?
          </div>
          <div className="w-2 h-2 bg-brand-500 rotate-45" />
        </div>
        <p className="text-sm text-white/50 mb-5 font-mono">
          הבנקים יתחרו ביניהם ואנחנו נשיג לכם את התנאים הטובים ביותר
        </p>
        <a
          href="https://wa.me/972500000000"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3.5 bg-brand-500 text-ink font-bold text-base hover:bg-brand-400 active:scale-95 transition-all font-mono text-center"
        >
          לתיאום ייעוץ ללא עלות ←
        </a>
      </div>

      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="mt-6 flex items-center gap-2 text-sm text-ink/40 hover:text-brand-600 transition-colors font-mono"
      >
        <ArrowRight size={16} />
        חזור לעריכה
      </button>
    </div>
  )
}

// ── Orchestrator ──────────────────────────────────────────────────────────
interface Props {
  onBack: () => void
}

export default function Step4Results({ onBack }: Props) {
  const [ready, setReady] = useState(false)
  const { getLoanAmount } = useMortgageStore()
  const [mix, setMix] = useState<MortgageMix | null>(null)

  useEffect(() => {
    const loan = getLoanAmount()
    const result = generateMortgageMix(loan, 25)
    const timer = setTimeout(() => {
      setMix(result)
      setReady(true)
    }, 2600)
    return () => clearTimeout(timer)
  }, [getLoanAmount])

  if (!ready || !mix) return <LoadingScreen />

  return <ResultsScreen mix={mix} onBack={onBack} />
}
