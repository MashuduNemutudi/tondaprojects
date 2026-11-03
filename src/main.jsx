import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowDown, ArrowRight, Check, ChevronDown, ClipboardCheck,
  Droplets, GraduationCap, Leaf, Mail, MapPin, Menu, Mountain,
  Phone, Pickaxe, Recycle, ShieldCheck, Sprout, X
} from 'lucide-react'
import logo from './assets/tonda-brochure-logo.png'
import brochurePhoto from './assets/tonda-brochure-hero.webp'
import environmentPhoto from './assets/tonda-brochure-environment.webp'
import waterPhoto from './assets/tonda-brochure-water.webp'
import wastePhoto from './assets/tonda-brochure-waste.webp'
import miningPhoto from './assets/tonda-brochure-mining.webp'
import './style.css'

const services = [
  {
    id: 'environmental',
    icon: Leaf,
    number: '01',
    title: 'Environmental Impact Assessment & Authorisations',
    image: environmentPhoto,
    imageAlt: 'Seedling held between fertile land and drought, from the Tonda brochure',
    intro: 'Support through environmental assessment processes and the authorisations required to move projects forward.',
    items: ['Environmental Impact Assessments (EIA)', 'Basic Assessment Reports (BAR)', 'Scoping and Environmental Impact Reporting', 'Environmental Authorisation (EA) Applications', 'Section 24 (G) Applications', 'Environmental Management Programmes (EMPr)', 'Public Participation Processes (PPP)', 'Appeals and Amendment Applications', 'Environmental Screening and Due Diligence']
  },
  {
    id: 'compliance',
    icon: ShieldCheck,
    number: '02',
    title: 'Environmental Compliance & Monitoring',
    image: environmentPhoto,
    imageAlt: 'Environmental stewardship photograph from the Tonda brochure',
    intro: 'Practical compliance oversight, monitoring and reporting throughout the project lifecycle.',
    items: ['Environmental Control Officer (ECO) Services', 'Compliance Auditing & Reporting', 'Environmental Monitoring Programmes', 'Environmental Compliance Monitoring', 'Environmental Performance Reviews']
  },
  {
    id: 'water',
    icon: Droplets,
    number: '03',
    title: 'Water Use Authorisations',
    image: waterPhoto,
    imageAlt: 'Water flowing into a pair of hands, from the Tonda brochure',
    intro: 'Guidance with water-use authorisations and applications under the relevant regulatory framework.',
    items: ['Water Use Licence Applications (WULA)', 'Integrated Water Use Authorisations', 'Section 21 (a–j) Water Use Applications', 'General Authorisation Registrations']
  },
  {
    id: 'waste',
    icon: Recycle,
    number: '04',
    title: 'Waste Management & Licensing',
    image: wastePhoto,
    imageAlt: 'Waste management site shown in the Tonda brochure',
    intro: 'Waste-related licensing, classification and management planning for projects and facilities.',
    items: ['Waste Management Licence Applications (WML)', 'Registration of Waste Activities', 'Waste Classification & Risk Assessment', 'Waste Storage & Disposal Facility Authorisations', 'Integrated Waste Management Plans (IWMP)']
  },
  {
    id: 'mining',
    icon: Pickaxe,
    number: '05',
    title: 'Mining & Mineral Regulatory Applications',
    image: miningPhoto,
    imageAlt: 'Mining vehicle and worker underground, from the Tonda brochure',
    intro: 'Regulatory application and planning support for mining and mineral development projects.',
    items: ['Mining Rights & Mining Permit Applications', 'Prospecting Rights Applications', 'Bulk Sampling Applications', 'Section 102 Amendments Section 11 Transactions', 'Closure Applications & Rehabilitation Plans', 'Financial Provision Calculations and Reviews (Section 24P)', 'Social and Labour Plans (SLP)']
  },
  {
    id: 'training',
    icon: GraduationCap,
    number: '06',
    title: 'Training & Capacity Building',
    image: environmentPhoto,
    imageAlt: 'Environmental stewardship photograph from the Tonda brochure',
    intro: 'Building environmental awareness and practical compliance capacity among teams and contractors.',
    items: ['Environmental Awareness Training', 'Legal Compliance Workshops', 'Waste Management Training', 'Water Management Training', 'Contractor Environmental Induction']
  }
]

const sectors = [
  {
    icon: Pickaxe,
    title: 'Mining & minerals',
    text: 'Regulatory and environmental support for mining and mineral projects.',
    image: miningPhoto,
    imageAlt: 'Mining vehicle and worker underground, from the Tonda brochure'
  },
  {
    icon: Mountain,
    title: 'Construction & infrastructure',
    text: 'Environmental processes and compliance across project stages.',
    image: brochurePhoto,
    imageAlt: 'Mining equipment, forest and haul truck photographs from the Tonda brochure'
  },
  {
    icon: Sprout,
    title: 'Development projects',
    text: 'Environmental planning and stewardship for development projects.',
    image: environmentPhoto,
    imageAlt: 'Seedling held between fertile land and drought, from the Tonda brochure'
  }
]

const navigation = [
  ['Home', '#home'],
  ['About', '#about'],
  ['Sectors', '#sectors'],
  ['Services', '#services'],
  ['Our approach', '#approach'],
  ['Contact', '#contact']
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openService, setOpenService] = useState('environmental')
  const [sending, setSending] = useState(false)
  const [formStatus, setFormStatus] = useState(null)
  const submissionInProgress = useRef(false)
  const activeService = services.find(service => service.id === openService) || services[0]

  const closeMenu = () => setMenuOpen(false)

  async function submitContact(event) {
    event.preventDefault()
    if (submissionInProgress.current) return

    submissionInProgress.current = true
    setSending(true)
    setFormStatus(null)

    const form = event.currentTarget
    const values = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.get('name'),
          email: values.get('email'),
          phone: values.get('phone'),
          service: values.get('service'),
          message: values.get('message'),
          companyWebsite: values.get('companyWebsite')
        })
      })
      let result
      try {
        result = await response.json()
      } catch {
        throw new Error('The enquiry service returned an unexpected response. Please email info@tondaprojects.co.za directly.')
      }

      if (!response.ok) {
        throw new Error(result.error || 'Your enquiry could not be sent. Please try again or email us directly.')
      }

      form.reset()
      setFormStatus({ type: 'success', message: 'Thank you. Your enquiry has been sent to Tonda Consultancy.' })
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error instanceof Error
          ? error.message
          : 'We could not connect to the enquiry service. Please email info@tondaprojects.co.za directly.'
      })
    } finally {
      submissionInProgress.current = false
      setSending(false)
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="header">
        <a href="#home" className="brand" onClick={closeMenu} aria-label="Tonda Consultancy & Projects home">
          <img src={logo} alt="" />
          <span><strong>TONDA</strong><small>CONSULTANCY & PROJECTS</small></span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav id="primary-navigation" className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
          {navigation.map(([label, href]) =>
            <a key={label} href={href} onClick={closeMenu}>{label}</a>
          )}
          <a className="nav-cta" href="#contact" onClick={closeMenu}>Request a consultation <ArrowRight size={16} aria-hidden="true" /></a>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" id="home">
          <div className="hero-texture" aria-hidden="true" />
          <div className="wrap hero-layout">
            <div className="hero-content">
              <div className="eyebrow light"><span /> ENVIRONMENTAL · MINING · INFRASTRUCTURE</div>
              <h1>Responsible projects.<br /><em>Sustainable</em> futures.</h1>
              <p>Environmental and social advisory for the mining, construction, infrastructure and development sectors.</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#services">Explore our services <ArrowRight size={17} aria-hidden="true" /></a>
                <a className="btn btn-ghost" href="#contact">Talk to our team</a>
              </div>
              <a className="hero-note" href="#about"><ArrowDown size={16} aria-hidden="true" /> Get to know Tonda</a>
            </div>
            <div className="hero-visual" aria-label="Tonda Consultancy and Projects logo">
              <div className="visual-orbit orbit-one" aria-hidden="true" />
              <div className="visual-orbit orbit-two" aria-hidden="true" />
              <div className="visual-crosshair" aria-hidden="true" />
              <div className="visual-mark"><img src={logo} alt="Tonda Consultancy and Projects" /></div>
              <div className="visual-caption"><span /> ENVIRONMENTAL STEWARDSHIP<br />&amp; RESPONSIBLE DEVELOPMENT</div>
              <span className="visual-coordinate">TONDA / 01</span>
            </div>
          </div>
          <div className="hero-index" aria-hidden="true">CONSULTANCY &amp; PROJECTS <span>—</span> 01</div>
        </section>

        <section className="intro section-pad" id="about">
          <div className="wrap intro-grid">
            <div className="intro-heading">
              <div className="eyebrow"><span /> WHO WE ARE</div>
              <h2>Environmental insight.<br /><em>Practical direction.</em></h2>
              <div className="section-rule" aria-hidden="true" />
            </div>
            <div className="intro-copy">
              <p className="lead">Tonda Consultancy and Projects (Pty) Ltd is a professional environmental and social advisory firm delivering integrated compliance, sustainability and stakeholder engagement solutions.</p>
              <p>Serving the mining, construction, infrastructure and development sectors, we support project proponents from feasibility through construction, operation and closure with regulatory compliance, environmental stewardship and effective community engagement.</p>
              <p>Our services are designed to reduce project risk, safeguard reputational integrity and strengthen social licence to operate. Tonda operates within the framework of key South African legislation, including NEMA, the MPRDA and the National Water Act (NWA).</p>
              <div className="legislation"><span>SOUTH AFRICAN LEGISLATION</span><strong>NEMA</strong><i /><strong>MPRDA</strong><i /><strong>National Water Act</strong></div>
            </div>
          </div>
        </section>

        <section className="sectors section-pad" id="sectors">
          <div className="wrap">
            <div className="section-heading">
              <div><div className="eyebrow light"><span /> SECTORS</div><h2>Supporting projects<br /><em>that shape tomorrow.</em></h2></div>
              <p>Environmental and regulatory support for projects across the sectors Tonda serves.</p>
            </div>
            <div className="sector-grid">
              {sectors.map(({ icon: Icon, title, text, image, imageAlt }, index) => (
                <article className="sector-card" key={title}>
                  <img className="sector-photo" src={image} alt={imageAlt} loading="lazy" decoding="async" />
                  <div className="sector-card-top"><div className="sector-icon"><Icon size={22} aria-hidden="true" /></div><span>0{index + 1}</span></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <div className="sector-card-line" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="services section-pad" id="services">
          <div className="wrap">
            <div className="services-top">
              <div><div className="eyebrow"><span /> WHAT WE DO</div><h2>Our services</h2></div>
              <p>Explore the areas where Tonda provides environmental, water, waste and mining regulatory support.</p>
            </div>
            <div className="service-layout">
              <div className="service-list">
                {services.map(({ id, icon: Icon, number, title, intro, items }) => {
                  const isOpen = openService === id
                  const panelId = `service-panel-${id}`
                  return (
                    <article className={`service-item ${isOpen ? 'active' : ''}`} key={id}>
                      <h3 className="service-heading">
                        <button
                          className="service-trigger"
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setOpenService(isOpen ? '' : id)}
                        >
                          <span className="service-number">{number}</span>
                          <span className="service-icon"><Icon size={22} aria-hidden="true" /></span>
                          <span className="service-title">{title}</span>
                          <ChevronDown className="chevron" size={19} aria-hidden="true" />
                        </button>
                      </h3>
                      {isOpen && (
                        <div className="service-detail" id={panelId}>
                          <p>{intro}</p>
                          <ul>{items.map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
              <aside className="service-aside">
                <div className="aside-topline"><span>{activeService.number}</span><span>—</span><span>06</span></div>
                <figure className="aside-photo">
                  <img src={activeService.image} alt={activeService.imageAlt} loading="lazy" decoding="async" />
                  <figcaption>{activeService.title} <span>·</span> BROCHURE PHOTO</figcaption>
                </figure>
                <div className="aside-mark"><Leaf size={31} aria-hidden="true" /></div>
                <span className="aside-label">THE TONDA APPROACH</span>
                <h3>Compliance<br />with purpose.</h3>
                <p>Thoughtful environmental planning and practical regulatory support for your project.</p>
                <a href="#contact">Discuss your project <ArrowRight size={16} aria-hidden="true" /></a>
              </aside>
            </div>
          </div>
        </section>

        <section className="approach-band" id="approach">
          <div className="wrap approach-inner">
            <div className="approach-icon"><ClipboardCheck size={27} aria-hidden="true" /></div>
            <div><div className="eyebrow light"><span /> OUR APPROACH</div><h2>Clear guidance at every<br /><em>stage of your project.</em></h2></div>
            <div className="approach-copy"><p>We work to understand your project, identify its environmental and regulatory requirements, and provide practical support through the relevant stages.</p><a href="#contact">Start a conversation <ArrowRight size={16} aria-hidden="true" /></a></div>
          </div>
        </section>

        <section className="contact section-pad" id="contact">
          <div className="wrap contact-grid">
            <div className="contact-info">
              <div className="eyebrow"><span /> GET IN TOUCH</div>
              <h2>Let’s talk about<br /><em>your project.</em></h2>
              <p>Contact Tonda Consultancy and Projects to discuss environmental, mining or infrastructure consulting requirements.</p>
              <a className="contact-line" href="tel:+27616654329"><span><Phone size={17} aria-hidden="true" /></span><div><small>CALL US</small><strong>061 665 4329</strong></div></a>
              <a className="contact-line" href="tel:+27109701736"><span><Phone size={17} aria-hidden="true" /></span><div><small>CALL US</small><strong>010 970 1736</strong></div></a>
              <a className="contact-line" href="mailto:info@tondaprojects.co.za"><span><Mail size={17} aria-hidden="true" /></span><div><small>EMAIL US</small><strong>info@tondaprojects.co.za</strong></div></a>
              <div className="contact-line"><span><MapPin size={17} aria-hidden="true" /></span><div><small>VISIT US</small><strong>18 Aureole Avenue, Northgate Office Park</strong><strong>Block 7A, Unit 73, Randburg, 2188</strong></div></div>
            </div>
            <form className="contact-form" onSubmit={submitContact}>
              <div className="form-heading"><span>CONTACT / 01</span><h3>Send an enquiry</h3><p>Tell us a little about your project and we’ll be in touch.</p></div>
              <div className="form-row">
                <label>Full name<input name="name" autoComplete="name" placeholder="Your full name" minLength="2" maxLength="120" required /></label>
                <label>Email address<input type="email" name="email" autoComplete="email" placeholder="name@example.com" maxLength="254" required /></label>
              </div>
              <label>Contact number<input name="phone" type="tel" autoComplete="tel" placeholder="e.g. 081 234 5678" pattern="[+0-9() .-]{7,30}" maxLength="30" required /></label>
              <label>Service of interest
                <select name="service" defaultValue="" required>
                  <option value="" disabled>Select a service</option>
                  {services.map(service => <option key={service.id}>{service.title}</option>)}
                  <option>General enquiry</option>
                </select>
              </label>
              <label>Message<textarea name="message" rows="4" placeholder="Tell us briefly about your project or enquiry..." minLength="10" maxLength="5000" required /></label>
              <div className="form-trap" aria-hidden="true">
                <label htmlFor="company-website">Leave this field empty</label>
                <input id="company-website" type="text" name="companyWebsite" tabIndex="-1" autoComplete="off" />
              </div>
              <button className="btn btn-primary form-submit" type="submit" disabled={sending}>
                {sending ? 'Sending enquiry…' : 'Send enquiry'}
                {!sending && <ArrowRight size={17} aria-hidden="true" />}
              </button>
              <p className="form-status" role={formStatus?.type === 'error' ? 'alert' : 'status'} aria-live="polite">
                {formStatus?.message || ''}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-top">
          <a href="#home" className="brand footer-brand"><img src={logo} alt="" /><span><strong>TONDA</strong><small>CONSULTANCY &amp; PROJECTS</small></span></a>
          <p>Environmental, Mining and Infrastructure Consultants</p>
          <a href="#home" className="back-top">Back to top <ArrowDown size={14} aria-hidden="true" /></a>
        </div>
        <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Tonda Consultancy and Projects (Pty) Ltd.</span><a href="mailto:info@tondaprojects.co.za">info@tondaprojects.co.za</a></div>
      </footer>
      <a className="floating-call" href="tel:+27616654329"><Phone size={17} aria-hidden="true" /><span>Call Tonda</span></a>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
