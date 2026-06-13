export default function Footer() {
  return (
    <footer className="bg-deep-brown border-t border-white/10 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-cream/50 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-forest-green flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-4 h-4" fill="none">
              <path d="M16 28 C16 28 6 21 6 13 C6 8.5 10.5 5 16 5 C21.5 5 26 8.5 26 13 C26 21 16 28 16 28Z" fill="#A8C97F" fillOpacity="0.8" />
              <line x1="16" y1="28" x2="16" y2="14" stroke="#F7F3EC" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span>© {new Date().getFullYear()} Projeto Verde · Barreiro, Portugal</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="mailto:escolaprojetoverde@gmail.com" className="hover:text-sage-green transition-colors">
            escolaprojetoverde@gmail.com
          </a>
          <a
            href="https://www.instagram.com/projetooverde/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sage-green transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  )
}
