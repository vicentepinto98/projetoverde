export default function Footer() {
  return (
    <footer className="bg-deep-brown border-t border-white/10 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-cream/50 text-sm">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Projeto Verde" className="h-8 w-auto" />
          <span>© {new Date().getFullYear()} Projeto Verde · Barreiro, Portugal</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="mailto:escolaprojetoverde@gmail.com" className="hover:text-sage-green transition-colors">
            escolaprojetoverde@gmail.com
          </a>
          <a
            href="https://www.instagram.com/projetoverdee/"
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
