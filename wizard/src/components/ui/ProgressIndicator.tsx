import { Check } from 'lucide-react'

const STEPS = [
  { label: 'מטרה' },
  { label: 'פרטי עסקה' },
  { label: 'פיננסים' },
  { label: 'גלו ריביות' },
]

interface Props {
  currentStep: number
}

export default function ProgressIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-start gap-0 select-none">
      {STEPS.map((step, i) => {
        const num = i + 1
        const done   = num < currentStep
        const active = num === currentStep

        return (
          <div key={num} className="flex flex-col items-center">
            <div className="flex items-center">
              {/* Circle */}
              <div
                className={[
                  'w-7 h-7 flex items-center justify-center text-xs font-mono font-bold transition-all duration-300',
                  done   ? 'bg-brand-500 text-ink'                         : '',
                  active ? 'bg-brand-500 text-ink ring-4 ring-brand-500/25' : '',
                  !done && !active ? 'bg-white/15 text-white/40'           : '',
                ].join(' ')}
              >
                {done ? <Check size={13} strokeWidth={3} /> : num}
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className={[
                    'h-px w-8 transition-all duration-500',
                    done ? 'bg-brand-500' : 'bg-white/20',
                  ].join(' ')}
                />
              )}
            </div>

            {/* Label */}
            <span
              className={[
                'text-[9px] mt-1.5 font-mono tracking-wider transition-colors duration-300',
                active ? 'text-brand-400'  : done ? 'text-brand-600/70' : 'text-white/30',
              ].join(' ')}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
