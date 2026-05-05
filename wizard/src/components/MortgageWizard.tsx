import { useMortgageStore } from '../store/useMortgageStore'
import LeftPanel from './layout/LeftPanel'
import ProgressIndicator from './ui/ProgressIndicator'
import Step1Goal from './steps/Step1Goal'
import Step2Deal from './steps/Step2Deal'
import Step3Financials from './steps/Step3Financials'
import Step4Results from './steps/Step4Results'

// ── Brand mark ───────────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="w-4 h-4 bg-brand-500 rotate-45 flex-shrink-0" />
      <span className="font-serif font-bold text-lg text-white tracking-wide leading-none">
        בוטיק משכנתאות
      </span>
    </div>
  )
}

// ── Top header ────────────────────────────────────────────────────────────
function Header({ step }: { step: number }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-ink flex-shrink-0">
      {/* CTA — left side */}
      <a
        href="tel:0300000000"
        className="hidden sm:inline-flex items-center gap-2 text-xs font-mono font-semibold text-ink bg-brand-500 hover:bg-brand-400 px-4 py-2.5 tracking-wider transition-colors"
      >
        📞 שיחת ייעוץ חינם
      </a>

      {/* Progress — center */}
      {step < 4 && (
        <div className="flex-1 flex justify-center">
          <ProgressIndicator currentStep={step} />
        </div>
      )}

      {/* Logo — right side */}
      <Logo />
    </header>
  )
}

// ── Main wizard ───────────────────────────────────────────────────────────
export default function MortgageWizard() {
  const { currentStep, nextStep, prevStep } = useMortgageStore()

  return (
    <div className="flex h-screen overflow-hidden font-sans" dir="rtl">
      {/* Left dark panel */}
      <LeftPanel step={currentStep} />

      {/* Right warm-paper panel */}
      <div className="flex-1 flex flex-col bg-paper overflow-hidden">
        <Header step={currentStep} />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4 py-8">
          {currentStep === 1 && (
            <Step1Goal onComplete={nextStep} />
          )}
          {currentStep === 2 && (
            <Step2Deal onComplete={nextStep} onBack={prevStep} />
          )}
          {currentStep === 3 && (
            <Step3Financials onComplete={nextStep} onBack={prevStep} />
          )}
          {currentStep === 4 && (
            <Step4Results onBack={prevStep} />
          )}
        </main>

        {/* Step counter */}
        {currentStep < 4 && (
          <div className="text-center py-3 text-xs text-ink/30 font-mono tracking-widest flex-shrink-0">
            שלב {currentStep} מתוך 3
          </div>
        )}
      </div>
    </div>
  )
}
