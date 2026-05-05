import { PropertyStatus } from '../store/useMortgageStore'

// ── Bank of Israel maximum LTV by property type ────────────────────────────
export const MAX_LTV: Record<PropertyStatus, number> = {
  FirstHome:  0.75,   // 75% financing
  Substitute: 0.70,   // 70% financing
  Investment: 0.50,   // 50% financing
  Refinance:  0.70,
}

export const MAX_PTI = 0.39  // max payment-to-income ratio

const STATUS_LABELS: Record<PropertyStatus, string> = {
  FirstHome:  'דירה ראשונה',
  Substitute: 'דירה חלופית',
  Investment: 'נכס להשקעה',
  Refinance:  'מיחזור',
}

// ── LTV Validation ─────────────────────────────────────────────────────────
export interface LTVResult {
  valid: boolean
  maxLTV: number
  actualLTV: number
  maxLoanAmount: number
  minEquity: number
  error?: string
}

export function validateLTV(
  propertyValue: number,
  equity: number,
  status: PropertyStatus,
): LTVResult {
  const loanAmount = propertyValue - equity
  const actualLTV = propertyValue > 0 ? loanAmount / propertyValue : 0
  const maxLTV = MAX_LTV[status]
  const maxLoanAmount = propertyValue * maxLTV
  const minEquity = propertyValue * (1 - maxLTV)

  if (actualLTV > maxLTV + 0.0001) {
    const minEquityStr = Math.ceil(minEquity).toLocaleString('he-IL')
    return {
      valid: false,
      maxLTV,
      actualLTV,
      maxLoanAmount,
      minEquity,
      error: `על פי תקנות בנק ישראל, עבור ${STATUS_LABELS[status]} המימון המקסימלי הוא ${Math.round(maxLTV * 100)}%. ההון העצמי המינימלי הנדרש הוא ₪${minEquityStr}.`,
    }
  }

  return { valid: true, maxLTV, actualLTV, maxLoanAmount, minEquity }
}

export function getMinEquity(propertyValue: number, status: PropertyStatus): number {
  return propertyValue * (1 - MAX_LTV[status])
}

// ── PTI Validation ─────────────────────────────────────────────────────────
export interface PTIResult {
  valid: boolean
  maxMonthlyPayment: number
  availableIncome: number
  error?: string
}

export function validatePTI(
  netMonthlyIncome: number,
  currentLoans: number,
  estimatedMonthlyPayment: number,
): PTIResult {
  const availableIncome = netMonthlyIncome - currentLoans
  const maxMonthlyPayment = availableIncome * MAX_PTI

  if (estimatedMonthlyPayment > maxMonthlyPayment + 1) {
    return {
      valid: false,
      maxMonthlyPayment,
      availableIncome,
      error: `ההחזר החודשי המשוער (₪${Math.round(estimatedMonthlyPayment).toLocaleString('he-IL')}) עולה על 39% מההכנסה הפנויה. המקסימום המותר הוא ₪${Math.round(maxMonthlyPayment).toLocaleString('he-IL')}/חודש.`,
    }
  }

  return { valid: true, maxMonthlyPayment, availableIncome }
}

// ── Zod-compatible validators for React Hook Form ──────────────────────────
export function ltvRefinement(status: PropertyStatus) {
  return (data: { propertyValue: number; equity: number }) => {
    if (!data.propertyValue || !data.equity) return true
    return validateLTV(data.propertyValue, data.equity, status).valid
  }
}
