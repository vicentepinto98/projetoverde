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
        <a href="#inicio" className="flex items-center gap-2 group">
          <img src="/logo.jpg" alt="Projeto Verde" className="h-12 w-auto" />
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
