export default function Hero() {
  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src="https://picsum.photos/seed/verde-hero/1920/1080"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark green overlay */}
      <div className="absolute inset-0 bg-forest-green/65" />

      {/* Decorative leaf shape bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-cream [clip-path:ellipse(60%_100%_at_50%_100%)]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p className="text-sage-green font-sans font-semibold text-sm tracking-[0.3em] uppercase mb-6">
          Barreiro, Portugal · 12 meses – 6 anos
        </p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-cream leading-tight mb-6">
          Comunidade de<br />
          <em className="not-italic text-sage-green">Aprendizagem</em><br />
          ao Ar Livre
        </h1>
        <p className="text-cream/80 text-lg md:text-xl font-light tracking-widest mb-10">
          Sentir · Explorar · Descobrir
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#filosofia"
            className="bg-cream text-forest-green px-8 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-sand transition-colors"
          >
            Conhecer-nos
          </a>
          <a
            href="#contacto"
            className="border-2 border-cream text-cream px-8 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-cream hover:text-forest-green transition-colors"
          >
            Contacto
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-cream/60">
        <span className="text-xs tracking-widest uppercase font-sans">Explorar</span>
        <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
