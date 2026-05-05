import { create } from 'zustand'

export type PropertyStatus = 'FirstHome' | 'Substitute' | 'Investment' | 'Refinance'

export interface MortgageState {
  // ── Navigation ──────────────────────────────────────
  currentStep: number          // 1-4

  // ── Step 1 — Goal ───────────────────────────────────
  propertyStatus: PropertyStatus | null

  // ── Step 2 — Deal Details ───────────────────────────
  propertyValue: number
  mortgageNeededDate: string   // "MM/YYYY"
  soldExistingProperty: boolean | null
  targetPropertyLocation: string

  // ── Step 3 — Financials ─────────────────────────────
  equity: number               // הון עצמי
  netMonthlyIncome: number
  currentLoans: number         // existing monthly obligations

  // ── Actions ─────────────────────────────────────────
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  setPropertyStatus: (s: PropertyStatus) => void
  setPropertyValue: (v: number) => void
  setMortgageNeededDate: (d: string) => void
  setSoldExistingProperty: (v: boolean) => void
  setTargetPropertyLocation: (loc: string) => void
  setEquity: (v: number) => void
  setNetMonthlyIncome: (v: number) => void
  setCurrentLoans: (v: number) => void

  // ── Computed helpers ────────────────────────────────
  getLoanAmount: () => number
}

export const useMortgageStore = create<MortgageState>((set, get) => ({
  currentStep: 1,

  propertyStatus: null,
  propertyValue: 0,
  mortgageNeededDate: '',
  soldExistingProperty: null,
  targetPropertyLocation: '',
  equity: 0,
  netMonthlyIncome: 0,
  currentLoans: 0,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 4) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  setPropertyStatus:          (propertyStatus) => set({ propertyStatus }),
  setPropertyValue:           (propertyValue) => set({ propertyValue }),
  setMortgageNeededDate:      (mortgageNeededDate) => set({ mortgageNeededDate }),
  setSoldExistingProperty:    (soldExistingProperty) => set({ soldExistingProperty }),
  setTargetPropertyLocation:  (targetPropertyLocation) => set({ targetPropertyLocation }),
  setEquity:                  (equity) => set({ equity }),
  setNetMonthlyIncome:        (netMonthlyIncome) => set({ netMonthlyIncome }),
  setCurrentLoans:            (currentLoans) => set({ currentLoans }),

  getLoanAmount: () => Math.max(0, get().propertyValue - get().equity),
}))
