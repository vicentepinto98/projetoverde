import { useState, useEffect } from 'react'

const links = [
  { label: 'Início', href: '#inicio' },
  { label: 'Filosofia', href: '#filosofia' },
  { label: 'Atividades', href: '#atividades' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-cream transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-forest-green flex items-center justify-center shrink-0">
            <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
              <path
                d="M16 28 C16 28 6 21 6 13 C6 8.5 10.5 5 16 5 C21.5 5 26 8.5 26 13 C26 21 16 28 16 28Z"
                fill="#A8C97F"
              />
              <line x1="16" y1="28" x2="16" y2="11" stroke="#F7F3EC" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M16 20 C14 17 10 17 8 14" stroke="#F7F3EC" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              <path d="M16 16 C18 13 22 13 24 10" stroke="#F7F3EC" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <span className="font-serif text-xl font-semibold text-forest-green group-hover:text-leaf-green transition-colors">
            Projeto Verde
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-deep-brown hover:text-forest-green transition-colors font-semibold text-sm tracking-wide"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Abrir menu"
        >
          <span className={`block w-6 h-0.5 bg-deep-brown transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-deep-brown transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-deep-brown transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <ul className="md:hidden bg-cream border-t border-sand px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block text-deep-brown hover:text-forest-green font-semibold text-base"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
