export default function Philosophy() {
  return (
    <section id="filosofia" className="py-24 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Image with organic blob shape */}
        <div className="relative flex justify-center">
          <div
            className="w-72 h-96 md:w-80 md:h-[480px] overflow-hidden"
            style={{ borderRadius: '60% 40% 55% 45% / 50% 45% 55% 50%' }}
          >
            <img
              src="https://picsum.photos/seed/verde-nature/640/800"
              alt="Criança a explorar a natureza"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative circle */}
          <div
            className="absolute -bottom-6 -left-6 w-32 h-32 bg-sage-green/30 -z-10"
            style={{ borderRadius: '40% 60% 50% 50% / 50% 40% 60% 50%' }}
          />
          <div
            className="absolute -top-6 -right-6 w-20 h-20 bg-sand -z-10"
            style={{ borderRadius: '50% 50% 40% 60% / 60% 40% 50% 50%' }}
          />
        </div>

        {/* Text */}
        <div>
          <p className="text-leaf-green font-semibold text-sm tracking-[0.25em] uppercase mb-4">
            A Nossa Filosofia
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-deep-brown leading-snug mb-6">
            A natureza é o melhor espaço de aprendizagem
          </h2>
          <div className="w-12 h-1 bg-sage-green rounded mb-8" />
          <p className="text-deep-brown/80 text-lg leading-relaxed mb-6">
            Acreditamos que as crianças aprendem melhor quando estão em contacto com o mundo natural.
            Na Projeto Verde, a floresta, a terra, a chuva e o sol são os nossos materiais didáticos.
          </p>
          <p className="text-deep-brown/80 text-lg leading-relaxed mb-8">
            Através do jogo livre, da exploração sensorial e de experiências autênticas ao ar livre,
            apoiamos o desenvolvimento integral de cada criança, ao seu ritmo e com a sua curiosidade natural.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-10">
            {[
              { number: '3+', label: 'Anos de comunidade' },
              { number: '5', label: 'Dias por semana' },
              { number: '∞', label: 'Momentos de descoberta' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-3xl font-bold text-forest-green mb-1">{stat.number}</div>
                <div className="text-xs text-deep-brown/60 font-semibold tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
