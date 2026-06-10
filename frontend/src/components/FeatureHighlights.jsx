// ============================================================
//  FeatureHighlights.jsx
//  3 alternating image+content blocks (left-right layout)
//  Edit FEATURE_BLOCKS array to change content
// ============================================================
import './FeatureHighlights.css'

// === EDIT: feature blocks ===
const FEATURE_BLOCKS = [
  {
    id: 'assistance',
    tag: 'Simple Process',
    title: 'Hassle-Free Loan Assistance',
    subtitle: 'Get quick loan support with simple documents and expert guidance every step of the way.',
    features: [
      { icon: '✓', text: 'Quick eligibility check in minutes' },
      { icon: '✓', text: 'Simple online document upload' },
      { icon: '✓', text: 'Support for multiple loan types' },
    ],
    btnLabel: 'Explore Loans',
    btnHref: '#loans',
    bgColor: '#EEF3FF',
    accentColor: '#1A56DB',
    // SVG illustration inline — replace with <img src="..." alt="..." /> if you have a real image
    illustration: 'assistance',
    imageRight: false,  // image LEFT, content RIGHT
  },
  {
    id: 'rates',
    tag: 'Best Rates',
    title: 'Lowest Rate Guidance',
    subtitle: 'Find the right loan option based on your profile with full transparency and expert support.',
    features: [
      { icon: '✓', text: 'Compare multiple loan products' },
      { icon: '✓', text: 'Transparent process — no hidden fees' },
      { icon: '✓', text: 'Expert support before you apply' },
    ],
    btnLabel: 'Check Eligibility',
    btnHref: '#emi',
    bgColor: '#F0FDF4',
    accentColor: '#00C853',
    illustration: 'rates',
    imageRight: true,   // content LEFT, image RIGHT
  },
  {
    id: 'tracking',
    tag: 'Stay in Control',
    title: 'Track Everything Easily',
    subtitle: 'Manage your loan application from anywhere with real-time updates and a mobile-friendly experience.',
    features: [
      { icon: '✓', text: 'Application status tracking' },
      { icon: '✓', text: 'Document verification updates' },
      { icon: '✓', text: 'Mobile-friendly experience' },
    ],
    btnLabel: 'Start Application',
    btnHref: '#apply',
    bgColor: '#F0FDF4',
    accentColor: '#16A34A',
    illustration: 'tracking',
    imageRight: false,
  },
]

// Inline SVG illustrations (replace with real images later)
function Illustration({ type, color, bg }) {
  if (type === 'assistance') return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="fh-illustration">
      <rect width="320" height="240" rx="20" fill={bg}/>
      {/* Document stack */}
      <rect x="60" y="50" width="130" height="160" rx="10" fill="white" stroke={color} strokeWidth="2" opacity="0.6"/>
      <rect x="75" y="40" width="130" height="160" rx="10" fill="white" stroke={color} strokeWidth="2" opacity="0.8"/>
      <rect x="90" y="30" width="130" height="160" rx="10" fill="white" stroke={color} strokeWidth="2"/>
      {/* Lines on document */}
      <line x1="110" y1="70" x2="200" y2="70" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
      <line x1="110" y1="88" x2="190" y2="88" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
      <line x1="110" y1="106" x2="195" y2="106" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
      <line x1="110" y1="124" x2="175" y2="124" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
      {/* Checkmark badge */}
      <circle cx="215" cy="155" r="32" fill={color}/>
      <path d="M202 155l9 9 18-18" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Upload arrow */}
      <circle cx="260" cy="70" r="22" fill={color} opacity="0.12"/>
      <path d="M260 82v-20M252 66l8-8 8 8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  if (type === 'rates') return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="fh-illustration">
      <rect width="320" height="240" rx="20" fill={bg}/>
      {/* Bar chart */}
      <rect x="55" y="140" width="38" height="70" rx="6" fill={color} opacity="0.25"/>
      <rect x="105" y="100" width="38" height="110" rx="6" fill={color} opacity="0.45"/>
      <rect x="155" y="70" width="38" height="140" rx="6" fill={color} opacity="0.65"/>
      <rect x="205" y="50" width="38" height="160" rx="6" fill={color}/>
      {/* X axis */}
      <line x1="45" y1="215" x2="275" y2="215" stroke="#E5E7EB" strokeWidth="2"/>
      {/* Trend arrow */}
      <path d="M60 165 Q130 100 255 55" stroke={color} strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" opacity="0.5"/>
      {/* Badge */}
      <rect x="170" y="18" width="110" height="30" rx="10" fill={color}/>
      <text x="225" y="38" textAnchor="middle" fill="white" fontFamily="Sora,sans-serif" fontWeight="700" fontSize="12">Best Rate ✓</text>
    </svg>
  )
  // tracking
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="fh-illustration">
      <rect width="320" height="240" rx="20" fill={bg}/>
      {/* Phone shape */}
      <rect x="105" y="30" width="110" height="180" rx="16" fill="white" stroke={color} strokeWidth="2"/>
      <rect x="115" y="44" width="90" height="152" rx="8" fill={bg}/>
      {/* Status steps */}
      {[
        { y: 60, label: 'Applied', done: true },
        { y: 95, label: 'Documents', done: true },
        { y: 130, label: 'Verification', done: false },
        { y: 165, label: 'Approved', done: false },
      ].map((s, i) => (
        <g key={i}>
          <circle cx="133" cy={s.y + 8} r="7" fill={s.done ? color : 'white'} stroke={color} strokeWidth="1.5"/>
          {s.done && <path d={`M${129} ${s.y+8}l4 4 6-6`} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
          <rect x="148" cy={s.y} width="50" height="8" rx="4" fill={color} opacity={s.done ? 0.7 : 0.2} y={s.y+4}/>
          {i < 3 && <line x1="133" y1={s.y+15} x2="133" y2={s.y+25} stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5"/>}
        </g>
      ))}
      {/* Notification dot */}
      <circle cx="215" cy="38" r="8" fill={color}/>
      <text x="215" y="43" textAnchor="middle" fill="white" fontFamily="Sora,sans-serif" fontSize="9" fontWeight="700">3</text>
    </svg>
  )
}

export default function FeatureHighlights() {
  return (
    <section className="fh-section" id="features" aria-label="Feature highlights">
      <div className="container">
        {/* Section header */}
        <div className="fh-header">
          <span className="section-label">Why LoanEase</span>
          <h2 className="section-title">Everything You Need, <span>In One Place</span></h2>
        </div>

        {/* Alternating blocks */}
        <div className="fh-blocks">
          {FEATURE_BLOCKS.map((block) => (
            <div
              key={block.id}
              className={`fh-block${block.imageRight ? ' fh-block--reversed' : ''}`}
            >
              {/* Illustration side */}
              <div className="fh-block__visual">
                <div className="fh-block__img-wrap" style={{ background: block.bgColor }}>
                  <Illustration type={block.illustration} color={block.accentColor} bg={block.bgColor} />
                </div>
              </div>

              {/* Content side */}
              <div className="fh-block__content">
                <span
                  className="fh-block__tag"
                  style={{ color: block.accentColor, background: block.bgColor }}
                >
                  {block.tag}
                </span>
                <h3 className="fh-block__title">{block.title}</h3>
                <p className="fh-block__subtitle">{block.subtitle}</p>

                <ul className="fh-block__features" aria-label="Key features">
                  {block.features.map((f) => (
                    <li key={f.text}>
                      <span
                        className="fh-block__check"
                        style={{ background: block.bgColor, color: block.accentColor }}
                        aria-hidden="true"
                      >
                        {f.icon}
                      </span>
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={block.btnHref}
                  className="fh-block__btn"
                  style={{ background: block.accentColor }}
                >
                  {block.btnLabel}
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
