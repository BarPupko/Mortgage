interface PanelContent {
  supertext: string
  stat: string
  description: string
  sub?: string
}

const CONTENT: Record<number, PanelContent> = {
  1: {
    supertext: 'היכרות קצרה וממשיכים',
    stat: '5 דקות',
    description: 'עד לקבלת הצעת משכנתא',
    sub: 'נרצה להכיר אתכם קצת — אל תדאגו, זה קצר',
  },
  2: {
    supertext: 'פרטי העסקה',
    stat: '243',
    description: 'מכרזי בנקים נוצרו החודש',
    sub: 'הבנקים מתחרים — לטובתכם',
  },
  3: {
    supertext: 'שאלון פיננסי',
    stat: '₪184K',
    description: 'חיסכון ממוצע ללקוח שלנו',
    sub: 'לעומת הצעת הבנק הראשונית',
  },
  4: {
    supertext: 'גלו את הריביות',
    stat: '100%',
    description: 'מהלקוחות ממליצים עלינו',
    sub: 'מבוסס על יותר מ-500 ביקורות',
  },
}

export default function LeftPanel({ step }: { step: number }) {
  const c = CONTENT[step] ?? CONTENT[1]

  return (
    <div className="hidden lg:flex w-[38%] min-h-full flex-col justify-between bg-ink p-10 select-none">
      {/* Top eyebrow */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-brand-500 rotate-45 flex-shrink-0" />
        <div className="text-[11px] font-mono font-semibold text-brand-500/70 tracking-[0.2em] uppercase">
          {c.supertext}
        </div>
      </div>

      {/* Main stat — vertically centered */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        <div key={step} className="animate-fade-up">
          <div className="text-[88px] font-serif font-black leading-none text-brand-500 tracking-tight">
            {c.stat}
          </div>
          <div className="mt-4 text-xl font-serif font-bold text-white/90 leading-snug">
            {c.description}
          </div>
          {c.sub && (
            <div className="mt-2 text-sm text-white/40 leading-relaxed">
              {c.sub}
            </div>
          )}
        </div>

        {/* Progress bars */}
        <div className="flex gap-1.5 mt-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={[
                'h-0.5 transition-all duration-500',
                s <= step ? 'bg-brand-500 w-8' : 'bg-white/15 w-4',
              ].join(' ')}
            />
          ))}
        </div>
      </div>

      {/* Bottom testimonial */}
      <div className="border-t border-white/10 pt-6 text-xs text-white/35 leading-relaxed">
        <span className="text-brand-500 font-serif text-base font-bold">"</span>
        חסכנו ₪230,000 בריבית. ממליצים בחום על השירות
        <span className="text-brand-500 font-serif text-base font-bold">"</span>
        <div className="mt-1 font-medium text-white/50">— דנה ואמיר ל., תל אביב</div>
      </div>
    </div>
  )
}
