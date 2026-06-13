import './App.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Philosophy from './components/Philosophy'
import Activities from './components/Activities'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="font-sans bg-cream text-deep-brown">
      <Nav />
      <Hero />
      <Philosophy />
      <Activities />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  )
}
