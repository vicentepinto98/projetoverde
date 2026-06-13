const photos = [
  { seed: 'verde-g1', w: 600, h: 400, span: 'col-span-1' },
  { seed: 'verde-g2', w: 600, h: 400, span: 'col-span-1' },
  { seed: 'verde-g3', w: 1200, h: 400, span: 'col-span-2' },
  { seed: 'verde-g4', w: 1200, h: 400, span: 'col-span-2' },
  { seed: 'verde-g5', w: 600, h: 400, span: 'col-span-1' },
  { seed: 'verde-g6', w: 600, h: 400, span: 'col-span-1' },
]

export default function Gallery() {
  return (
    <section id="galeria" className="py-24 bg-forest-green">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sage-green font-semibold text-sm tracking-[0.25em] uppercase mb-4">
            Momentos
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream">
            A Vida na Floresta
          </h2>
          <div className="w-12 h-1 bg-sage-green rounded mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map((p) => (
            <div
              key={p.seed}
              className={`${p.span} overflow-hidden rounded-2xl`}
              style={{ aspectRatio: p.w / p.h }}
            >
              <img
                src={`https://picsum.photos/seed/${p.seed}/${p.w}/${p.h}`}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/projetooverde/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border-2 border-sage-green text-cream px-8 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-sage-green hover:text-forest-green transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Ver mais no Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
