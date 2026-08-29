import Nav from './components/Nav'
import Hero from './components/Hero'
import TrustStrip from './components/TrustStrip'
import Manifesto from './components/Manifesto'
import CaseFileShowcase from './components/CaseFileShowcase'
import Process from './components/Process'
import TransformationScrub from './components/TransformationScrub'
import Heritage from './components/Heritage'
import Testimonials from './components/Testimonials'
import Gallery from './components/Gallery'
import Visit from './components/Visit'
import Footer from './components/Footer'
import { siteConfig } from './config'

function App() {
  return (
    <div style={{ position: 'relative' }}>
      <Nav />
      <Hero variant={siteConfig.heroVariant} />
      <TrustStrip />
      <Manifesto />
      <CaseFileShowcase />
      <Process />
      <TransformationScrub />
      <Heritage />
      {siteConfig.showTestimonials && <Testimonials />}
      <Gallery />
      <Visit />
      <Footer />
    </div>
  )
}

export default App
