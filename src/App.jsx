import { useState, useEffect } from 'react'
import './App.css'
import { NavLogo3D } from './Logo3D'
import Logo3D from './Logo3D'
import ShaderBackground from './ShaderBackground'

const CA = 'BMhHXK6XQSGLkX3KjoUcppmBsssUKAqUYwQ68tMzpump'

function App() {
  const [copied, setCopied] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const copyCA = () => {
    navigator.clipboard.writeText(CA)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="site">
      <ShaderBackground />
      {/* NAV */}
      <nav className={`nav${scrolled ? ' nav-scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">
              <NavLogo3D />
            </a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#narrative">Narrative</a>
            <a href="#media">Media</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="cta-title">DUMB MONEY ISN'T<br />AN INSULT.<br /><span>IT'S POWER TO THE PEOPLE.</span></h1>
          <div className="hero-ca" onClick={copyCA} role="button" tabIndex={0}>
            <span className="ca-label">CA</span>
            <span className="ca-address">{CA}</span>
            <span className="ca-copy">{copied ? 'COPIED!' : 'COPY'}</span>
          </div>
          <div className="hero-buttons">
            <a
              href={`https://jup.ag/tokens/${CA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              BUY $DM
            </a>
            <a
              href="https://x.com/i/communities/2015635201292910792"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              JOIN COMMUNITY
            </a>
            <a
              href="https://x.com/dumbmoneymeme"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              OFFICIAL X
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-video-wrapper">
            <video
              autoPlay
              muted
              controls
              loop
              playsInline
              preload="auto"
              className="hero-video"
            >
              <source src="/assets/motivational-video.mp4" type="video/mp4" />
            </video>
            <div className="video-logo-overlay">
              <Logo3D />
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-strip">
        <div className="ticker-track">
          {[...Array(24)].map((_, i) => (
            <span key={i} className="ticker-item">
              DUMB MONEY ALWAYS WINS &bull;&nbsp; THE AVERAGE JOE — WHAT DO WE HAVE? DUMBMONEY &bull;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="section-grid">
          <div className="section-left">
            <div className="section-label">001 — ABOUT</div>
            <h2 className="section-title">What is<br />Dumb Money?</h2>
            <img src="/assets/dumbmoney-about.jpeg" alt="Dumb Money" className="about-image" />
          </div>
          <div className="section-right">
            <p className="about-lead">
              Dumb Money isn't just a meme. It's a narrative retail already understands.
            </p>
            <p>
              At its core, Dumb Money represents something that shows up in markets every
              single day: people acting before permission, before clarity, before institutions
              decide it's acceptable.
            </p>
            <p>
              The term itself matters. "Dumb Money" isn't crypto jargon. It's a phrase people
              have heard on CNBC, during the GME era, and from the movie. That familiarity
              makes organic marketing easier — because the narrative already exists in people's heads.
            </p>
            <p>
              Dumb Money fits naturally into the way retail already experiences markets.
              Coinbase screenshots, simple price charts, and familiar interfaces are how most
              people first engage with crypto. When something shows up there, it feels real
              and legible — not niche or insider-only.
            </p>
            <p>
              The hedge funds have it all — billions of dollars, insider access, and every
              advantage money can buy. But Dumb Money isn't for them. It's for the working
              people. For years they've been dominating, rigging the game, and laughing at
              retail. It's time to give the power back to the people.
            </p>
          </div>
        </div>
      </section>


      {/* NARRATIVE */}
      <section className="narrative" id="narrative">
        <div className="narrative-header">
          <div className="section-label">002 — NARRATIVE</div>
          <h2 className="section-title">DUMB MONEY<br />ALWAYS ON TOP</h2>
        </div>
        <div className="narrative-grid">
          <div className="narrative-card">
            <div className="narrative-card-num">01</div>
            <h3>EVERYONE IS DUMB</h3>
            <p>
              Coinbase screenshots, simple price charts, familiar interfaces.
              When something shows up on tools retail uses every day, it feels real.
              You don't need a long explanation to understand what's happening.
            </p>
          </div>
          <div className="narrative-card">
            <div className="narrative-card-num">02</div>
            <h3>Cultural Memory</h3>
            <p>
              Dumb Money has a connection to the GME story without relying on it.
              Roaring Kitty's brother posting. Michael Burry going long. Old conversations
              resurfacing. Dumb Money benefits from that cultural memory.
            </p>
          </div>
          <div className="narrative-card">
            <div className="narrative-card-num">03</div>
            <h3>CODED</h3>
            <p>
              Every day something is labelled dumb, useless, or irrational.
              And every day, some of those things outperform expectations.
              That pattern isn't rare. It's structural.
            </p>
          </div>
          <div className="narrative-card">
            <div className="narrative-card-num">04</div>
            <h3>BEING DUMB OVER ANYTHING</h3>
            <p>
              You don't need perfect clarity to win. You need conviction, timing,
              and the willingness to stay when others leave.
              That belief matters. Belief is how retail wins again.
            </p>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="quote-section">
        <blockquote className="big-quote">
          <span className="quote-mark">"</span>
          Dumb money never left.<br />It's just beginning.
          <span className="quote-mark">"</span>
        </blockquote>
      </section>

      {/* MEDIA */}
      <section className="media" id="media">
        <div className="section-label center-label">003 — MEDIA</div>
        <h2 className="section-title center-title">DUMBMONEY MILLIONAIRES</h2>
        <div className="video-container">
          <video
            controls
            playsInline
            preload="metadata"
            className="video-player"
          >
            <source src="/assets/dumbmoney-video.mp4" type="video/mp4" />
          </video>
        </div>
      </section>



      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">
            <div className="footer-logo-3d">
              <NavLogo3D />
            </div>
          </div>
          <div className="footer-right">
            <a href="https://x.com/dumbmoneymeme" target="_blank" rel="noopener noreferrer">Twitter / X</a>
            <a href="https://x.com/i/communities/2015635201292910792" target="_blank" rel="noopener noreferrer">Community</a>
            <a href={`https://dexscreener.com/solana/${CA}`} target="_blank" rel="noopener noreferrer">Dexscreener</a>
          </div>
        </div>
        <div className="footer-disclaimer-full">
          <p>
            $DM Token is a meme token created for entertainment purposes only and has no association with any stocks, equities, securities, indices, companies, or other financial or business entities. Any resemblance or association between $DM and the "Dumb Money" movie or GameStop is purely coincidental and intended for satirical or humorous purposes. $DM has no affiliation with the Dumb Money film, GameStop, or any related entities. All depictions of individuals on this site are intended as parody or satire and should not be taken as factual representations. This website is unofficial and operates solely as a fan page dedicated to $DM, with no affiliation to any official organization or entity. This site also functions as a link directory for content relevant to the $DM community; however, linking does not imply any endorsement, recommendation, or affiliation with the linked content or its creators. Any documents linked for listing, exchange, or regulatory purposes are hosted here for easy access and do not constitute an endorsement or affiliation with any of the listed or cited entities. $DM token is a meme token with no intrinsic value or expectation of financial return. By using this site, users acknowledge that all interactions and interpretations are at their own risk, and the site host assumes no liability for any user actions or assumptions based on the content presented. Users accept full responsibility for any and all losses, damages, or liabilities arising from their use of the site, including but not limited to financial losses, data loss, or any form of harm. Any links to third-party websites are provided for convenience, and users access such external sites at their own risk, with no liability to the host for any consequences resulting from third-party content or interactions. This site does not offer financial, legal, or professional advice. All content is intended solely for entertainment and should not be relied upon for financial, investment, or legal decisions. The site host makes no guarantees regarding the accuracy, completeness, or currency of the information presented. All content is provided "as-is," without warranties of any kind, either expressed or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. To the fullest extent permitted by law, the site host shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from or related to use of this site. By using this site, users agree to indemnify and hold the site host harmless from any claims, damages, liabilities, and expenses arising from their use of the site or violation of these terms. The site host reserves the right to modify this disclaimer at any time, and continued use of the site constitutes acceptance of any updated terms.
          </p>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2025 $DUMBMONEY &mdash; Belief is how retail wins again.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
