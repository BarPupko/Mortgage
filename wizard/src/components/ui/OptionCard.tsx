import { ReactNode } from 'react'

interface Props {
  selected?: boolean
  onClick: () => void
  icon?: ReactNode
  title: string
  subtitle?: string
  wide?: boolean
}

export default function OptionCard({ selected, onClick, icon, title, subtitle, wide }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group flex flex-col items-center justify-center gap-3 border-2 transition-all duration-200 cursor-pointer text-center',
        wide ? 'p-6' : 'p-5',
        selected
          ? 'border-brand-600 bg-brand-50 shadow-md shadow-brand-500/15'
          : 'border-line bg-paper hover:border-brand-500 hover:bg-brand-50 hover:shadow-sm',
      ].join(' ')}
    >
      {icon && (
        <span
          className={[
            'text-4xl transition-transform duration-200 group-hover:scale-110',
            selected ? 'scale-110' : '',
          ].join(' ')}
        >
          {icon}
        </span>
      )}
      <div>
        <div
          className={[
            'font-semibold text-sm leading-snug',
            selected ? 'text-brand-700' : 'text-ink',
          ].join(' ')}
        >
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-ink/50 mt-0.5 leading-snug">{subtitle}</div>
        )}
      </div>
    </button>
  )
}
