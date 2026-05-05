import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight } from 'lucide-react'
import { useMortgageStore } from '../../store/useMortgageStore'
import OptionCard from '../ui/OptionCard'
import NumberInput from '../ui/NumberInput'

// ── Shared continue button ─────────────────────────────────────────────────
function ContinueBtn({ label = 'המשך', disabled = false }: { label?: string; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="mt-6 px-8 py-3.5 bg-brand-500 text-ink font-bold text-base hover:bg-brand-400 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-sans"
    >
      {label} <span className="font-mono">←</span>
    </button>
  )
}

// ── ISRAELIS city list for autocomplete ───────────────────────────────────
const CITIES = [
  'תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד',
  'נתניה', 'באר שבע', 'בני ברק', 'הרצליה', 'כפר סבא', 'רמת גן',
  'רחובות', 'חולון', 'חדרה', 'לוד', 'מודיעין', 'אילת', 'אשקלון',
  'רעננה', 'נס ציונה', 'עפולה', 'נצרת עילית', 'כרמיאל', 'טבריה',
  'יהוד', 'רמת השרון', 'גבעתיים', 'בת ים', 'קריית גת', 'אופקים',
]

// ── Sub-step 1: When do you need the mortgage? ────────────────────────────
const MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']
const YEARS = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i)

function DateQuestion({ onNext }: { onNext: () => void }) {
  const { setMortgageNeededDate } = useMortgageStore()
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())

  const handleSubmit = () => {
    setMortgageNeededDate(`${String(month + 1).padStart(2, '0')}/${year}`)
    onNext()
  }

  const selectCls = 'flex-1 border-2 border-line bg-paper rounded-none px-4 py-3.5 text-ink font-mono font-semibold focus:border-brand-600 outline-none'

  return (
    <div className="step-enter w-full max-w-md px-4">
      <div className="flex items-start gap-3 mb-8">
        <span className="text-brand-500 font-mono mt-0.5">←</span>
        <h2 className="font-serif text-2xl font-bold text-ink leading-snug">
          מתי תצטרכו את כספי המשכנתא?
        </h2>
      </div>

      <div className="flex gap-3 items-center">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          aria-label="חודש"
          className={selectCls}
        >
          {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          aria-label="שנה"
          className={`${selectCls} flex-none w-28`}
        >
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-3.5 bg-brand-500 text-ink font-bold hover:bg-brand-400 active:scale-95 transition-all font-mono"
        >
          המשך ←
        </button>
      </div>

      <p className="mt-3 text-xs text-ink/40 font-mono tracking-wide">מידע נוסף ℹ️</p>
    </div>
  )
}

// ── Sub-step 2: Property price ────────────────────────────────────────────
const priceSchema = z.object({
  propertyValue: z.coerce.number().min(100_000, 'יש להזין מחיר תקין (מינימום ₪100,000)'),
})
type PriceForm = z.infer<typeof priceSchema>

function PriceQuestion({ onNext }: { onNext: () => void }) {
  const { setPropertyValue } = useMortgageStore()
  const { register, handleSubmit, formState: { errors } } = useForm<PriceForm>({
    resolver: zodResolver(priceSchema),
  })

  const onSubmit = (data: PriceForm) => {
    setPropertyValue(data.propertyValue)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="step-enter w-full max-w-md px-4">
      <div className="flex items-start gap-3 mb-8">
        <span className="text-brand-500 font-mono mt-0.5">←</span>
        <h2 className="font-serif text-2xl font-bold text-ink leading-snug">
          כמה תשלמו על הנכס?
          <span className="block text-sm font-sans font-normal text-ink/40 mt-1">המחיר לאחר הנחה</span>
        </h2>
      </div>

      <NumberInput
        {...register('propertyValue')}
        placeholder="1,500,000"
        error={errors.propertyValue?.message}
        autoFocus
      />
      <ContinueBtn />
    </form>
  )
}

// ── Sub-step 3: Already sold old property? (Substitute only) ──────────────
function SoldQuestion({ onNext }: { onNext: () => void }) {
  const { setSoldExistingProperty } = useMortgageStore()

  const handle = (v: boolean) => {
    setSoldExistingProperty(v)
    setTimeout(onNext, 200)
  }

  return (
    <div className="step-enter w-full max-w-md px-4">
      <div className="flex items-start gap-3 mb-8">
        <span className="text-brand-500 font-mono mt-0.5">←</span>
        <h2 className="font-serif text-2xl font-bold text-ink leading-snug">
          האם כבר מכרתם את הנכס הישן?
        </h2>
      </div>

      <div className="flex gap-4">
        <OptionCard icon="✓" title="כן" onClick={() => handle(true)} wide />
        <OptionCard icon="✗" title="לא" onClick={() => handle(false)} wide />
      </div>
    </div>
  )
}

// ── Sub-step 4: Location ──────────────────────────────────────────────────
function LocationQuestion({ onNext }: { onNext: () => void }) {
  const { setTargetPropertyLocation } = useMortgageStore()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  const filtered = CITIES.filter((c) =>
    c.includes(query) && query.length >= 1
  ).slice(0, 6)

  const select = (city: string) => {
    setQuery(city)
    setOpen(false)
  }

  const handleContinue = () => {
    if (!query.trim()) { setError('נא לבחור יישוב'); return }
    setTargetPropertyLocation(query.trim())
    onNext()
  }

  return (
    <div className="step-enter w-full max-w-md px-4">
      <div className="flex items-start gap-3 mb-8">
        <span className="text-brand-500 font-mono mt-0.5">←</span>
        <h2 className="font-serif text-2xl font-bold text-ink leading-snug">
          באיזה יישוב נמצא הנכס?
        </h2>
      </div>

      <div className="relative">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setError('') }}
          onFocus={() => setOpen(true)}
          placeholder="לדוגמה: תל אביב"
          className="w-full border-2 border-line bg-paper px-4 py-3.5 text-ink font-semibold focus:border-brand-600 outline-none text-right placeholder-ink/25"
        />
        {open && filtered.length > 0 && (
          <ul className="absolute z-10 w-full mt-0 bg-paper border border-line shadow-lg overflow-hidden">
            {filtered.map((city) => (
              <li
                key={city}
                onMouseDown={() => select(city)}
                className="px-4 py-3 text-right text-sm font-medium text-ink hover:bg-brand-50 cursor-pointer border-b border-line/50 last:border-b-0"
              >
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}

      <button
        type="button"
        onClick={handleContinue}
        className="mt-6 px-8 py-3.5 bg-brand-500 text-ink font-bold text-base hover:bg-brand-400 active:scale-95 transition-all font-mono"
      >
        המשך ←
      </button>
    </div>
  )
}

// ── Orchestrator ──────────────────────────────────────────────────────────
interface Props {
  onComplete: () => void
  onBack: () => void
}

export default function Step2Deal({ onComplete, onBack }: Props) {
  const { propertyStatus } = useMortgageStore()
  const [sub, setSub] = useState(1)

  const handleBack = () => {
    if (sub === 1) onBack()
    else setSub((s) => s - 1)
  }

  const includesSold = propertyStatus === 'Substitute'

  const advance = (fromSub: number) => {
    if (fromSub === 2 && !includesSold) {
      setSub(4)
    } else if (fromSub === 4) {
      onComplete()
    } else {
      setSub(fromSub + 1)
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      <button
        type="button"
        onClick={handleBack}
        className="self-start mb-6 flex items-center gap-2 text-sm text-ink/40 hover:text-brand-600 transition-colors font-mono"
      >
        <ArrowRight size={16} />
        חזור
      </button>

      {sub === 1 && <DateQuestion     onNext={() => advance(1)} />}
      {sub === 2 && <PriceQuestion    onNext={() => advance(2)} />}
      {sub === 3 && <SoldQuestion     onNext={() => advance(3)} />}
      {sub === 4 && <LocationQuestion onNext={() => advance(4)} />}
    </div>
  )
}
