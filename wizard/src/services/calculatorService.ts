export const PRIME_RATE = 6.25  // current Bank of Israel prime rate %

export interface MortgageTrack {
  name: string
  description: string
  principal: number
  annualRate: number
  termMonths: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  barClass: string   // Tailwind bg class for the bar segment
  bgClass: string    // Tailwind bg class for the card background
  textClass: string  // Tailwind text class for the amount
  dotClass: string   // Tailwind bg class for the diamond dot
  pct: number        // share of total loan
}

export interface MortgageMix {
  totalLoan: number
  termYears: number
  tracks: MortgageTrack[]
  totalMonthlyPayment: number
  totalPayment: number
  totalInterest: number
}

export interface AmortizationRow {
  month: number
  payment: number
  interest: number
  principal: number
  balance: number
}

// ── Core Spitzer (שפיצר) formula ───────────────────────────────────────────
export function spitzer(
  principal: number,
  annualRatePct: number,
  termMonths: number,
): number {
  if (principal <= 0 || termMonths <= 0) return 0
  if (annualRatePct === 0) return principal / termMonths
  const r = annualRatePct / 100 / 12
  return (principal * r) / (1 - Math.pow(1 + r, -termMonths))
}

// ── Full amortization schedule ─────────────────────────────────────────────
export function amortizationSchedule(
  principal: number,
  annualRatePct: number,
  termMonths: number,
): AmortizationRow[] {
  const r = annualRatePct / 100 / 12
  const payment = spitzer(principal, annualRatePct, termMonths)
  const rows: AmortizationRow[] = []
  let balance = principal

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * r
    const princ = payment - interest
    balance = Math.max(0, balance - princ)
    rows.push({ month, payment, interest, principal: princ, balance })
  }
  return rows
}

// ── Standard Israeli Mortgage Mix (תמהיל) ─────────────────────────────────
// Split: 1/3 Prime | 1/3 קל"צ (Non-linked Fixed) | 1/3 מ"צ (Linked Variable)
export function generateMortgageMix(
  totalLoan: number,
  termYears = 25,
): MortgageMix {
  const termMonths = termYears * 12
  const third = totalLoan / 3

  const trackDefs = [
    {
      name: 'פריים',
      description: 'ריבית משתנה צמודה לפריים',
      annualRate: PRIME_RATE - 0.5,
      barClass:  'bg-brand-500',
      bgClass:   'bg-brand-50',
      textClass: 'text-brand-700',
      dotClass:  'bg-brand-500',
      pct: 33.33,
    },
    {
      name: 'קל"צ',
      description: 'ריבית קבועה לא צמודה',
      annualRate: 4.5,
      barClass:  'bg-ink',
      bgClass:   'bg-paper',
      textClass: 'text-ink',
      dotClass:  'bg-ink',
      pct: 33.33,
    },
    {
      name: 'מ"צ',
      description: 'ריבית משתנה צמודת מדד',
      annualRate: 3.5,
      barClass:  'bg-brand-700',
      bgClass:   'bg-brand-100',
      textClass: 'text-brand-800',
      dotClass:  'bg-brand-700',
      pct: 33.34,
    },
  ]

  let totalMonthlyPayment = 0
  let totalPayment = 0
  let totalInterest = 0

  const tracks: MortgageTrack[] = trackDefs.map((def) => {
    const monthly = spitzer(third, def.annualRate, termMonths)
    const total = monthly * termMonths
    const interest = total - third
    totalMonthlyPayment += monthly
    totalPayment += total
    totalInterest += interest
    return {
      ...def,
      principal: third,
      termMonths,
      monthlyPayment: monthly,
      totalPayment: total,
      totalInterest: interest,
    }
  })

  return { totalLoan, termYears, tracks, totalMonthlyPayment, totalPayment, totalInterest }
}

export const fmt = (n: number) =>
  Math.round(n).toLocaleString('he-IL')
