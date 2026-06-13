const activities = [
  {
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <circle cx="24" cy="24" r="22" fill="#A8C97F" fillOpacity="0.3" />
        <path d="M24 38 C24 38 10 29 10 19 C10 13 16 8 24 8 C32 8 38 13 38 19 C38 29 24 38 24 38Z" fill="#5A8A2E" fillOpacity="0.7" />
        <line x1="24" y1="38" x2="24" y2="14" stroke="#2D5A1B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 28 C21 24 15 24 12 20" stroke="#2D5A1B" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 22 C27 18 33 18 36 14" stroke="#2D5A1B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Playdates',
    description:
      'Encontros semanais ao ar livre onde as crianças exploram, brincam e criam laços com a natureza e entre si.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <circle cx="24" cy="24" r="22" fill="#A8C97F" fillOpacity="0.3" />
        <rect x="14" y="16" width="20" height="18" rx="3" fill="#5A8A2E" fillOpacity="0.5" />
        <path d="M19 24 C19 24 22 28 29 22" stroke="#2D5A1B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 20 L24 13 L34 20" stroke="#2D5A1B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    title: 'Workshops',
    description:
      'Atividades criativas e sensoriais para explorar a arte, a ciência e os elementos naturais com as mãos.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <circle cx="24" cy="24" r="22" fill="#A8C97F" fillOpacity="0.3" />
        <path d="M24 14 C24 14 14 19 14 28 C14 33 18.5 37 24 37 C29.5 37 34 33 34 28 C34 19 24 14 24 14Z" fill="#5A8A2E" fillOpacity="0.5" />
        <path d="M20 28 C20 25.8 21.8 24 24 24 C26.2 24 28 25.8 28 28" stroke="#2D5A1B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="24" cy="20" r="2" fill="#2D5A1B" />
      </svg>
    ),
    title: 'Festas de Aniversário',
    description:
      'Celebrações especiais em plena natureza, com jogos, exploração e momentos mágicos inesquecíveis.',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <circle cx="24" cy="24" r="22" fill="#A8C97F" fillOpacity="0.3" />
        <path d="M16 32 L16 22 L24 16 L32 22 L32 32 Z" fill="#5A8A2E" fillOpacity="0.5" stroke="#2D5A1B" strokeWidth="2" strokeLinejoin="round" />
        <rect x="20" y="26" width="8" height="6" rx="1" fill="#2D5A1B" fillOpacity="0.7" />
        <path d="M12 24 L24 14 L36 24" stroke="#2D5A1B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    title: 'Eventos Comunitários',
    description:
      'Encontros abertos à comunidade para partilhar, aprender e celebrar a ligação entre famílias e natureza.',
  },
]

export default function Activities() {
  return (
    <section id="atividades" className="py-24 bg-sand/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-leaf-green font-semibold text-sm tracking-[0.25em] uppercase mb-4">
            O Que Fazemos
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-deep-brown">
            Atividades e Experiências
          </h2>
          <div className="w-12 h-1 bg-sage-green rounded mx-auto mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {activities.map((act) => (
            <div
              key={act.title}
              className="bg-cream rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-6">{act.icon}</div>
              <h3 className="font-serif text-xl font-bold text-deep-brown mb-3">{act.title}</h3>
              <p className="text-deep-brown/70 text-sm leading-relaxed">{act.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
