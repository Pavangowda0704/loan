// ============================================================
//  FinancialInsights.jsx
//  Blog/resource cards with category tag + read more link
//  Edit INSIGHTS array to change articles
// ============================================================
import './FinancialInsights.css'

// === EDIT: blog/resource cards ===
const INSIGHTS = [
  {
    id: 1,
    category: 'Home Loan',
    categoryColor: '#1A56DB',
    categoryBg: '#EEF3FF',
    title: 'How to Choose the Right Home Loan?',
    desc: 'A step-by-step guide to comparing home loan options, interest rates, and tenure to find the best fit for your budget.',
    readTime: '4 min read',
    href: '#',
    // SVG placeholder — replace with real image path if available
    illustrationType: 'home',
  },
  {
    id: 2,
    category: 'Documentation',
    categoryColor: '#00C853',
    categoryBg: '#F0FDF4',
    title: 'Documents Required for Loan Approval',
    desc: 'Know exactly which KYC, income, and property documents you need ready before starting your loan application.',
    readTime: '3 min read',
    href: '#',
    illustrationType: 'docs',
  },
  {
    id: 3,
    category: 'EMI Guide',
    categoryColor: '#16A34A',
    categoryBg: '#F0FDF4',
    title: 'How EMI is Calculated?',
    desc: 'Understand the EMI formula, how interest rate and tenure affect your monthly payment, and tips to reduce your EMI burden.',
    readTime: '5 min read',
    href: '#',
    illustrationType: 'emi',
  },
]

function InsightIllustration({ type, color, bg }) {
  if (type === 'home') return (
    <svg viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="340" height="180" fill={bg}/>
      <rect x="95" y="70" width="150" height="100" rx="6" fill="white" stroke={color} strokeWidth="1.5"/>
      <polygon points="70,75 170,20 270,75" fill={color} opacity="0.85"/>
      <rect x="140" y="115" width="60" height="55" rx="4" fill={color} opacity="0.2"/>
      <rect x="105" y="85" width="50" height="40" rx="4" fill={color} opacity="0.12"/>
      <rect x="185" y="85" width="50" height="40" rx="4" fill={color} opacity="0.12"/>
      <circle cx="270" cy="50" r="20" fill={color} opacity="0.15"/>
      <path d="M263 50l5 5 9-9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  if (type === 'docs') return (
    <svg viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="340" height="180" fill={bg}/>
      <rect x="80" y="30" width="110" height="140" rx="8" fill="white" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <rect x="105" y="25" width="110" height="140" rx="8" fill="white" stroke={color} strokeWidth="1.5" opacity="0.8"/>
      <rect x="130" y="20" width="110" height="140" rx="8" fill="white" stroke={color} strokeWidth="1.5"/>
      <line x1="150" y1="55" x2="220" y2="55" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
      <line x1="150" y1="73" x2="215" y2="73" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.3"/>
      <line x1="150" y1="91" x2="220" y2="91" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.3"/>
      <line x1="150" y1="109" x2="200" y2="109" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.25"/>
      <circle cx="268" cy="130" r="28" fill={color}/>
      <path d="M257 130l8 8 14-14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  // emi
  return (
    <svg viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="340" height="180" fill={bg}/>
      {/* Calculator body */}
      <rect x="105" y="20" width="130" height="150" rx="12" fill="white" stroke={color} strokeWidth="1.5"/>
      {/* Screen */}
      <rect x="118" y="35" width="104" height="40" rx="6" fill={bg}/>
      <text x="222" y="62" textAnchor="end" fill={color} fontFamily="Sora,sans-serif" fontWeight="700" fontSize="16">₹17,208</text>
      {/* Buttons grid */}
      {[0,1,2,3].map(row => [0,1,2].map(col => (
        <rect key={`${row}-${col}`}
          x={118 + col*36} y={88 + row*22}
          width="28" height="14" rx="4"
          fill={row===3 && col===2 ? color : bg}
          opacity={row===3 && col===2 ? 1 : 0.8}
        />
      )))}
      {/* Trend line outside */}
      <path d="M260 155 Q285 120 310 90" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
      <circle cx="310" cy="90" r="6" fill={color} opacity="0.6"/>
    </svg>
  )
}

export default function FinancialInsights() {
  return (
    <section className="fi-section" id="insights" aria-label="Financial insights">
      <div className="container">
        <div className="fi-header">
          <span className="section-label">Resources</span>
          <h2 className="section-title">Financial <span>Insights</span></h2>
          <p className="section-subtitle">Simple guides to help you make better loan decisions.</p>
        </div>

        <div className="fi-grid" role="list">
          {INSIGHTS.map((item) => (
            <article className="fi-card card" key={item.id} role="listitem">
              {/* Illustration */}
              <div className="fi-card__img" style={{ background: item.categoryBg }}>
                <InsightIllustration
                  type={item.illustrationType}
                  color={item.categoryColor}
                  bg={item.categoryBg}
                />
              </div>

              {/* Body */}
              <div className="fi-card__body">
                <div className="fi-card__meta">
                  <span
                    className="fi-card__tag"
                    style={{ color: item.categoryColor, background: item.categoryBg }}
                  >
                    {item.category}
                  </span>
                  <span className="fi-card__time">{item.readTime}</span>
                </div>
                <h3 className="fi-card__title">{item.title}</h3>
                <p className="fi-card__desc">{item.desc}</p>
                <a href={item.href} className="fi-card__link" style={{ color: item.categoryColor }}>
                  Read More
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
