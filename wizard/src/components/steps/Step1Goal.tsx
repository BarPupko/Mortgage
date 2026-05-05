import { useState } from 'react'
import { PropertyStatus, useMortgageStore } from '../../store/useMortgageStore'
import OptionCard from '../ui/OptionCard'

const GOALS: { status: PropertyStatus; icon: string; title: string; subtitle: string }[] = [
  {
    status: 'FirstHome',
    icon: '🏡',
    title: 'קונים נכס ראשון',
    subtitle: 'אין לנו נכס — זו הדירה הראשונה שלנו',
  },
  {
    status: 'Substitute',
    icon: '🏠',
    title: 'משפרי דיור',
    subtitle: 'יש לנו נכס — אנחנו מוכרים וקונים חדש',
  },
  {
    status: 'Investment',
    icon: '🏢',
    title: 'אנחנו משקיעים',
    subtitle: 'יש לנו נכס ואנחנו רוצים להוסיף עוד',
  },
  {
    status: 'Refinance',
    icon: '🔄',
    title: 'מיחזור משכנתא',
    subtitle: 'רוצים לשפר את תנאי המשכנתא הקיימת',
  },
]

interface Props {
  onComplete: () => void
}

export default function Step1Goal({ onComplete }: Props) {
  const { setPropertyStatus } = useMortgageStore()
  const [selected, setSelected] = useState<PropertyStatus | null>(null)

  const handleSelect = (status: PropertyStatus) => {
    setSelected(status)
    setPropertyStatus(status)
    setTimeout(onComplete, 220)
  }

  return (
    <div className="step-enter w-full max-w-xl px-4">
      <div className="flex items-start gap-3 mb-8">
        <span className="text-brand-500 font-mono mt-0.5">←</span>
        <h2 className="font-serif text-2xl font-bold text-ink leading-snug">
          מה המטרה שלכם?
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {GOALS.map((g) => (
          <OptionCard
            key={g.status}
            selected={selected === g.status}
            onClick={() => handleSelect(g.status)}
            icon={g.icon}
            title={g.title}
            subtitle={g.subtitle}
            wide
          />
        ))}
      </div>
    </div>
  )
}
