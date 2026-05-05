import { forwardRef, InputHTMLAttributes } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  prefix?: string
  suffix?: string
  error?: string
}

const NumberInput = forwardRef<HTMLInputElement, Props>(
  ({ prefix = '₪', suffix, error, className = '', ...rest }, ref) => (
    <div className="w-full max-w-sm">
      <div
        className={[
          'flex items-center border-2 bg-paper transition-colors duration-200',
          error ? 'border-red-400 focus-within:border-red-500' : 'border-line focus-within:border-brand-600',
        ].join(' ')}
      >
        {prefix && (
          <span className="pr-4 pl-1 text-lg font-mono font-semibold text-brand-600 select-none">{prefix}</span>
        )}
        <input
          ref={ref}
          type="number"
          min={0}
          className={[
            'flex-1 py-3.5 text-lg font-mono font-semibold text-ink outline-none bg-transparent text-right placeholder-ink/25',
            !prefix ? 'pr-4' : '',
            suffix ? '' : 'pl-4',
            className,
          ].join(' ')}
          {...rest}
        />
        {suffix && (
          <span className="pl-4 pr-1 text-sm font-medium text-ink/40 select-none">{suffix}</span>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  ),
)
NumberInput.displayName = 'NumberInput'
export default NumberInput
