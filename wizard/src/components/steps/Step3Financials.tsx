import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight } from 'lucide-react'
import { useMortgageStore } from '../../store/useMortgageStore'
import { validateLTV, getMinEquity } from '../../services/mortgageRules'
import { spitzer } from '../../services/calculatorService'
import NumberInput from '../ui/NumberInput'
import OptionCard from '../ui/OptionCard'

// ── Sub-step 1: Equity (הון עצמי) ─────────────────────────────────────────
function EquityQuestion({ onNext }: { onNext: () => void }) {
  const { propertyValue, propertyStatus, setEquity } = useMortgageStore()
  const status = propertyStatus ?? 'FirstHome'
  const minEquity = getMinEquity(propertyValue, status)

  const schema = z.object({
    equity: z.coerce
      .number()
      .min(1, 'יש להזין הון עצמי')
      .refine(
        (v) => validateLTV(propertyValue, v, status).valid,
        { message: validateLTV(propertyValue, minEquity - 1, status).error ?? 'הון עצמי נמוך מדי' },
      ),
  })

  const { register, handleSubmit, formState: { errors } } = useForm<{ equity: number }>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: { equity: number }) => {
    setEquity(data.equity)
    onNext()
  }

  const ltvInfo = {
    FirstHome:  '75%',
    Substitute: '70%',
    Investment: '50%',
    Refinance:  '70%',
  }[status]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="step-enter w-full max-w-md px-4">
      <div className="flex items-start gap-3 mb-2">
        <span className="text-brand-500 font-mono mt-0.5">←</span>
        <h2 className="font-serif text-2xl font-bold text-ink leading-snug">
          כמה הון עצמי יש לכם?
        </h2>
      </div>
      <p className="text-sm text-ink/50 mb-6 mr-6 font-mono">
        מינימום {ltvInfo} מהשווי — לפחות ₪{Math.ceil(minEquity).toLocaleString('he-IL')}
      </p>

      <NumberInput
        {...register('equity')}
        placeholder={Math.ceil(minEquity).toLocaleString('he-IL')}
        error={errors.equity?.message}
        autoFocus
      />

      <button
        type="submit"
        className="mt-6 px-8 py-3.5 bg-brand-500 text-ink font-bold text-base hover:bg-brand-400 active:scale-95 transition-all font-mono"
      >
        המשך ←
      </button>
    </form>
  )
}

// ── Sub-step 2: Net monthly income ────────────────────────────────────────
const incomeSchema = z.object({
  income: z.coerce.number().min(3_000, 'יש להזין הכנסה חודשית נטו (מינימום ₪3,000)'),
})
type IncomeForm = z.infer<typeof incomeSchema>

function IncomeQuestion({ onNext }: { onNext: () => void }) {
  const { setNetMonthlyIncome } = useMortgageStore()
  const { register, handleSubmit, formState: { errors } } = useForm<IncomeForm>({
    resolver: zodResolver(incomeSchema),
  })

  const onSubmit = (data: IncomeForm) => {
    setNetMonthlyIncome(data.income)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="step-enter w-full max-w-md px-4">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-brand-500 font-mono mt-0.5">←</span>
        <h2 className="font-serif text-2xl font-bold text-ink leading-snug">
          מה ההכנסה החודשית נטו שלכם?
          <span className="block text-sm font-sans font-normal text-ink/40 mt-1">סה"כ של כל הלווים יחד</span>
        </h2>
      </div>

      <NumberInput
        {...register('income')}
        placeholder="25,000"
        error={errors.income?.message}
        autoFocus
      />

      <button
        type="submit"
        className="mt-6 px-8 py-3.5 bg-brand-500 text-ink font-bold text-base hover:bg-brand-400 active:scale-95 transition-all font-mono"
      >
        המשך ←
      </button>
    </form>
  )
}

// ── Sub-step 3: Has existing loans? ──────────────────────────────────────
function HasLoansQuestion({ onNext }: { onNext: (hasLoans: boolean) => void }) {
  return (
    <div className="step-enter w-full max-w-md px-4">
      <div className="flex items-start gap-3 mb-8">
        <span className="text-brand-500 font-mono mt-0.5">←</span>
        <h2 className="font-serif text-2xl font-bold text-ink leading-snug">
          האם יש לכם הלוואות קיימות?
          <span className="block text-sm font-sans font-normal text-ink/40 mt-1">
            רכב, אשראי, הלוואות אחרות
          </span>
        </h2>
      </div>
      <div className="flex gap-4">
        <OptionCard icon="✓" title="כן" onClick={() => onNext(true)} wide />
        <OptionCard icon="✗" title="לא" onClick={() => onNext(false)} wide />
      </div>
    </div>
  )
}

// ── Sub-step 4: Monthly loans amount ─────────────────────────────────────
const loansSchema = z.object({
  loans: z.coerce.number().min(0),
})

function LoansAmountQuestion({ onNext }: { onNext: () => void }) {
  const { setCurrentLoans } = useMortgageStore()
  const { register, handleSubmit, formState: { errors } } = useForm<{ loans: number }>({
    resolver: zodResolver(loansSchema),
  })

  const onSubmit = (data: { loans: number }) => {
    setCurrentLoans(data.loans)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="step-enter w-full max-w-md px-4">
      <div className="flex items-start gap-3 mb-8">
        <span className="text-brand-500 font-mono mt-0.5">←</span>
        <h2 className="font-serif text-2xl font-bold text-ink leading-snug">
          מה ההחזר החודשי הכולל על ההלוואות?
        </h2>
      </div>

      <NumberInput
        {...register('loans')}
        placeholder="3,000"
        error={errors.loans?.message}
        autoFocus
      />

      <button
        type="submit"
        className="mt-6 px-8 py-3.5 bg-brand-500 text-ink font-bold text-base hover:bg-brand-400 active:scale-95 transition-all font-mono"
      >
        המשך ←
      </button>
    </form>
  )
}

// ── PTI warning screen ─────────────────────────────────────────────────────
function PTIWarning({ maxPayment, onContinue }: { maxPayment: number; onContinue: () => void }) {
  return (
    <div className="step-enter w-full max-w-md px-4">
      <div className="mb-8 p-5 bg-brand-50 border-2 border-brand-200">
        <div className="text-3xl mb-3">⚠️</div>
        <h3 className="font-serif text-lg font-bold text-brand-800 mb-2">שימו לב — מגבלת PTI</h3>
        <p className="text-sm text-brand-700 leading-relaxed">
          על פי תקנות בנק ישראל, ההחזר החודשי המקסימלי שתוכלו לקחת הוא{' '}
          <strong className="font-mono">₪{Math.round(maxPayment).toLocaleString('he-IL')}</strong> (39% מההכנסה הפנויה).
        </p>
        <p className="text-sm text-brand-600 mt-2">
          היועץ יוכל להציג לכם אפשרויות מותאמות במסגרת המגבלה.
        </p>
      </div>
      <button
        type="button"
        onClick={onContinue}
        className="px-8 py-3.5 bg-brand-500 text-ink font-bold text-base hover:bg-brand-400 active:scale-95 transition-all font-mono"
      >
        המשך בכל זאת ←
      </button>
    </div>
  )
}

// ── Orchestrator ──────────────────────────────────────────────────────────
interface Props {
  onComplete: () => void
  onBack: () => void
}

export default function Step3Financials({ onComplete, onBack }: Props) {
  const [sub, setSub] = useState(1)
  const [showPTIWarn, setShowPTIWarn] = useState(false)
  const { netMonthlyIncome, currentLoans, getLoanAmount } = useMortgageStore()

  const handleBack = () => {
    if (sub === 1) onBack()
    else setSub((s) => s - 1)
  }

  const afterLoans = () => {
    const loan = getLoanAmount()
    const term = 25 * 12
    const estimated = spitzer(loan, 4.8, term)
    const available = (netMonthlyIncome - currentLoans) * 0.39
    if (estimated > available + 1) {
      setShowPTIWarn(true)
    } else {
      onComplete()
    }
  }

  if (showPTIWarn) {
    const available = (netMonthlyIncome - currentLoans) * 0.39
    return (
      <div className="w-full flex flex-col items-center">
        <PTIWarning maxPayment={available} onContinue={onComplete} />
      </div>
    )
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

      {sub === 1 && <EquityQuestion    onNext={() => setSub(2)} />}
      {sub === 2 && <IncomeQuestion    onNext={() => setSub(3)} />}
      {sub === 3 && (
        <HasLoansQuestion
          onNext={(has) => {
            if (!has) { useMortgageStore.getState().setCurrentLoans(0); afterLoans() }
            else setSub(4)
          }}
        />
      )}
      {sub === 4 && <LoansAmountQuestion onNext={afterLoans} />}
    </div>
  )
}
