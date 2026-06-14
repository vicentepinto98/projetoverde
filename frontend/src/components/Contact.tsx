import { useState, FormEvent } from 'react'

const errorMessages: Record<string, string> = {
  required: 'Obrigatório',
  'invalid format': 'Email inválido',
}

function t(e: string) {
  return errorMessages[e] ?? e
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})
    setSubmitError(false)
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setSent(true); return }
      if (res.status === 400) {
        const body = await res.json()
        setErrors(body.errors ?? {})
        return
      }
      setSubmitError(true)
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  function resetForm() {
    setForm({ name: '', email: '', message: '' })
    setErrors({})
    setSubmitError(false)
    setSent(false)
  }

  const inputClass =
    'w-full bg-white/10 border border-cream/30 text-cream placeholder-cream/40 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-sage-green transition-colors'

  return (
    <section id="contacto" className="py-24 bg-deep-brown">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sage-green font-semibold text-sm tracking-[0.25em] uppercase mb-4">
            Contacto
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream">
            Fala Connosco
          </h2>
          <div className="w-12 h-1 bg-sage-green rounded mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <div className="flex flex-col gap-8">
            <p className="text-cream/80 text-lg leading-relaxed">
              Tens perguntas sobre a Projeto Verde? Queres inscrever o teu filho?
              Entra em contacto — respondemos sempre com carinho.
            </p>

            <div className="flex flex-col gap-6">
              {[
                {
                  label: 'Email',
                  value: 'escolaprojetoverde@gmail.com',
                  href: 'mailto:escolaprojetoverde@gmail.com',
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                },
                {
                  label: 'Localização',
                  value: 'Barreiro, Setúbal, Portugal',
                  href: 'https://maps.google.com/?q=Barreiro,Portugal',
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                },
                {
                  label: 'Instagram',
                  value: '@projetoverdee',
                  href: 'https://www.instagram.com/projetoverdee/',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-cream/80 hover:text-sage-green transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sage-green shrink-0 group-hover:bg-white/20 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-cream/40 uppercase tracking-wide font-semibold mb-0.5">{item.label}</div>
                    <div className="text-sm">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="bg-white/10 rounded-3xl p-10 text-center">
                <div className="text-5xl mb-4">🌿</div>
                <h3 className="font-serif text-2xl font-bold text-cream mb-2">Mensagem enviada!</h3>
                <p className="text-cream/70 mb-8">Obrigado pelo contacto. Respondemos em breve.</p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-sage-green text-forest-green font-bold text-sm tracking-wide px-8 py-3 rounded-full hover:bg-cream transition-colors"
                >
                  Enviar nova mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="O teu nome"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{t(errors.name)}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="O teu email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{t(errors.email)}</p>}
                </div>
                <div>
                  <textarea
                    placeholder="A tua mensagem..."
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputClass} resize-none`}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{t(errors.message)}</p>}
                </div>
                {submitError && (
                  <div className="flex items-center justify-between bg-red-900/30 border border-red-400/30 text-cream/80 text-sm rounded-xl px-4 py-3">
                    <span>Ocorreu um erro. Tenta novamente.</span>
                    <button
                      type="button"
                      onClick={() => setSubmitError(false)}
                      className="text-sage-green font-semibold ml-4 hover:text-cream transition-colors shrink-0"
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-sage-green text-forest-green font-bold text-sm tracking-wide px-8 py-3 rounded-full hover:bg-cream transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'A enviar…' : 'Enviar mensagem'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
