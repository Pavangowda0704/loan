
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './LoanWorkflow.css'
import API from '../api'

const PRODUCT_COPY = {
  personal: {
    label: 'Personal Loan',
    title: 'Salaried Personal Loan',
    subtitle: 'Quick funds for your personal needs',
    image: '👨‍💼',
    amount: '₹8,50,000',
    rate: '11.49% p.a.',
    tenure: 'Up to 60 Months',
    approval: 'In 24 Hours',
    bullets: ['Minimal documentation', 'Quick approval', 'Flexible repayment', '100% digital process', 'No collateral required', 'Transparent process'],
    documents: ['Aadhaar Card', 'PAN Card', 'Salary Slips (Latest 3 Months)', 'Bank Statement (Last 6 Months)', 'Passport Size Photo'],
  },
  vehicle: {
    label: 'Vehicle Loan',
    title: 'Vehicle Loan',
    subtitle: 'Finance your new or used car, bike, or commercial vehicle',
    image: '🚗',
    amount: '₹12,00,000',
    rate: '9.25% p.a.',
    tenure: 'Up to 84 Months',
    approval: 'In 48 Hours',
    bullets: ['New and used vehicle support', 'Up to 100% on-road funding', 'Quick eligibility check', 'Doorstep document support', 'Flexible EMI tenure', 'Easy status tracking'],
    documents: ['Aadhaar Card', 'PAN Card', 'Income Proof', 'Bank Statement (Last 6 Months)', 'Vehicle Quotation / RC Copy'],
  },
}

function money(amount) {
  const n = Number(String(amount).replace(/\D/g, '')) || 850000
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

function Stepper({ current }) {
  const steps = ['Personal Info', 'Employment Info', 'Loan Details', 'Review']
  return (
    <div className="flow-stepper">
      {steps.map((s, i) => (
        <div className={`flow-step ${current >= i + 1 ? 'active' : ''}`} key={s}>
          <span>{i + 1}</span>
          <p>{s}</p>
        </div>
      ))}
    </div>
  )
}

function DetailPage({ product, go }) {
  const p = PRODUCT_COPY[product]
  return (
    <section className="workflow-page">
      <div className="workflow-container">
        <button className="back-link" onClick={() => go('home')}>← Back to Home</button>
        <p className="breadcrumb">Home › {p.label} › {p.title}</p>

        <div className="detail-hero card">
          <div>
            <h1>{p.title}</h1>
            <p>{p.subtitle} with minimal documents and flexible repayment options.</p>
          </div>
          <div className="detail-visual" aria-hidden="true">{p.image}</div>
        </div>

        <div className="quick-stats">
          <div>Loan up to <strong>{p.amount}</strong></div>
          <div>Interest Rate <strong>{p.rate}</strong></div>
          <div>Tenure <strong>{p.tenure}</strong></div>
          <div>Approval <strong>{p.approval}</strong></div>
        </div>

        <div className="benefit-grid">
          {p.bullets.map((b) => <div key={b} className="benefit-item">✓ {b}</div>)}
        </div>

        <div className="workflow-actions">
          <button className="btn btn-primary" onClick={() => go('eligibility')}>Check Eligibility</button>
          <button className="btn btn-outline" onClick={() => go('apply')}>Apply Now</button>
        </div>
      </div>
    </section>
  )
}

function EligibilityPage({ product, go }) {
  const p = PRODUCT_COPY[product]
  const [form, setForm] = useState({ name: 'Ramesh Kumar', mobile: '9876543210', income: '50000', employment: product === 'personal' ? 'Salaried' : 'Salaried', city: 'Bangalore' })
  const eligibleAmount = useMemo(() => money((Number(form.income) || 50000) * (product === 'vehicle' ? 18 : 17)), [form.income, product])

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <section className="workflow-page">
      <div className="workflow-container">
        <button className="back-link" onClick={() => go('detail')}>← Back</button>
        <div className="two-col">
          <div className="card form-card">
            <h1>Check Your Eligibility</h1>
            <p>It only takes a minute for {p.label}.</p>
            <label>Full Name<input name="name" value={form.name} onChange={update} /></label>
            <label>Mobile Number<input name="mobile" value={form.mobile} onChange={update} /></label>
            <label>Monthly Income<input name="income" value={form.income} onChange={update} /></label>
            <label>Employment Type<select name="employment" value={form.employment} onChange={update}><option>Salaried</option><option>Self Employed</option></select></label>
            <label>City<select name="city" value={form.city} onChange={update}><option>Bangalore</option><option>Mysore</option><option>Mumbai</option><option>Chennai</option></select></label>
          </div>
          <div className="card result-card">
            <div className="success-icon">✓</div>
            <h2>Great!</h2>
            <p>You are eligible for</p>
            <h1>{eligibleAmount}</h1>
            <div className="mini-stats">
              <span>Interest Rate <b>{p.rate}</b></span>
              <span>Tenure <b>{p.tenure}</b></span>
            </div>
            <button className="btn btn-primary" onClick={() => go('apply')}>Apply Now</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function ApplyPage({ product, go }) {
  const p = PRODUCT_COPY[product]
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullName: 'Ramesh Kumar',
    mobile: '9876543210',
    email: 'ramesh@gmail.com',
    dob: '1990-05-10',
    pan: 'ABCDE1234F',
    city: 'Bangalore',
    employmentType: 'Salaried',
    companyName: '',
    monthlyIncome: '50000',
    workExperience: '',
    requiredAmount: product === 'vehicle' ? '700000' : '850000',
    preferredTenure: product === 'vehicle' ? '84 Months' : '60 Months',
    purpose: product === 'vehicle' ? 'Vehicle purchase' : 'Personal need',
  })

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submitApplication() {
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        loanProduct: product,
        loanType: p.title,
        monthlyIncome: Number(form.monthlyIncome),
        requiredAmount: Number(form.requiredAmount),
        documents: p.documents.map((name) => ({ name, uploaded: false })),
      }
      const res = await API.post('/applications', payload)
      localStorage.setItem('latestApplication', JSON.stringify(res.data.application))
      go('documents')
    } catch (err) {
      setError(err.response?.data?.message || 'Backend not connected. Start the server and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="workflow-page">
      <div className="workflow-container">
        <button className="back-link" onClick={() => go('eligibility')}>← Back</button>
        <div className="card form-card wide">
          <h1>Apply for {p.title}</h1>
          <p>Provide your details to proceed.</p>
          <Stepper current={step} />
          {step === 1 && (
            <div className="form-grid">
              <label>Full Name<input name="fullName" value={form.fullName} onChange={update} /></label>
              <label>Mobile Number<input name="mobile" value={form.mobile} onChange={update} /></label>
              <label>Email Address<input name="email" value={form.email} onChange={update} /></label>
              <label>Date of Birth<input type="date" name="dob" value={form.dob} onChange={update} /></label>
              <label>PAN Number<input name="pan" value={form.pan} onChange={update} /></label>
              <label>City<input name="city" value={form.city} onChange={update} /></label>
            </div>
          )}
          {step === 2 && (
            <div className="form-grid">
              <label>Employment Type<select name="employmentType" value={form.employmentType} onChange={update}><option>Salaried</option><option>Self Employed</option></select></label>
              <label>Company / Business Name<input name="companyName" value={form.companyName} onChange={update} placeholder="Enter company name" /></label>
              <label>Monthly Income<input name="monthlyIncome" value={form.monthlyIncome} onChange={update} /></label>
              <label>Work Experience<input name="workExperience" value={form.workExperience} onChange={update} placeholder="Example: 3 Years" /></label>
            </div>
          )}
          {step === 3 && (
            <div className="form-grid">
              <label>Loan Type<input value={p.label} readOnly /></label>
              <label>Required Amount<input name="requiredAmount" value={form.requiredAmount} onChange={update} /></label>
              <label>Preferred Tenure<select name="preferredTenure" value={form.preferredTenure} onChange={update}><option>36 Months</option><option>60 Months</option><option>84 Months</option></select></label>
              <label>Purpose<input name="purpose" value={form.purpose} onChange={update} /></label>
            </div>
          )}
          {step === 4 && (
            <div className="review-box">
              <h3>Review Details</h3>
              <p>Please confirm the details and continue to upload documents.</p>
              <p><b>Loan Type:</b> {p.label}</p>
              <p><b>Application Status:</b> Ready for document upload</p>
              {error && <p className="error-text">{error}</p>}
            </div>
          )}
          <div className="workflow-actions right">
            {step > 1 && <button className="btn btn-outline" onClick={() => setStep(step - 1)}>Previous</button>}
            {step < 4 ? <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next →</button> : <button className="btn btn-primary" disabled={loading} onClick={submitApplication}>{loading ? 'Saving...' : 'Save & Continue to Documents'}</button>}
          </div>
        </div>
      </div>
    </section>
  )
}

function DocumentsPage({ product, go }) {
  const p = PRODUCT_COPY[product]
  const [uploaded, setUploaded] = useState({ 'Aadhaar Card': true, 'PAN Card': true })

  function submitDocuments() {
    const latest = JSON.parse(localStorage.getItem('latestApplication') || 'null')
    if (latest) {
      latest.documents = p.documents.map((name) => ({ name, uploaded: Boolean(uploaded[name]) }))
      localStorage.setItem('latestApplication', JSON.stringify(latest))
    }
    go('submitted')
  }
  return (
    <section className="workflow-page">
      <div className="workflow-container">
        <button className="back-link" onClick={() => go('apply')}>← Previous</button>
        <div className="card form-card wide">
          <div className="doc-head"><div><h1>Upload Documents</h1><p>Please upload clear and valid documents.</p></div><span>Step 4 of 4</span></div>
          <div className="doc-grid">
            {p.documents.map((d) => (
              <div className="doc-card" key={d}>
                <div className="doc-icon">📄</div>
                <div><h4>{d}</h4><p>JPG, PNG or PDF</p></div>
                <button className={uploaded[d] ? 'uploaded' : ''} onClick={() => setUploaded({ ...uploaded, [d]: true })}>{uploaded[d] ? 'Uploaded' : 'Upload'}</button>
              </div>
            ))}
          </div>
          <div className="secure-note">🔒 Your data is 100% secure with us</div>
          <div className="workflow-actions right">
            <button className="btn btn-primary" onClick={submitDocuments}>Submit Application</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function SubmittedPage({ product, go }) {
  const p = PRODUCT_COPY[product]
  const latest = JSON.parse(localStorage.getItem('latestApplication') || 'null')
  const date = latest?.createdAt ? new Date(latest.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')
  return (
    <section className="workflow-page center-page">
      <div className="card submitted-card">
        <div className="success-icon big">✓</div>
        <h1>Your Application is Submitted!</h1>
        <p>Thank you, {latest?.fullName || 'Ramesh Kumar'}. Your application has been received successfully.</p>
        <div className="summary-box">
          <p><span>Application ID</span><b>{latest?.applicationId || 'LEP12345678'}</b></p>
          <p><span>Loan Type</span><b>{p.title}</b></p>
          <p><span>Application Date</span><b>{date}</b></p>
        </div>
        <button className="btn btn-primary" onClick={() => go('track')}>Track Application</button>
      </div>
    </section>
  )
}

function TrackPage({ product, go }) {
  const [applicationId, setApplicationId] = useState(() => JSON.parse(localStorage.getItem('latestApplication') || 'null')?.applicationId || '')
  const [mobile, setMobile] = useState(() => JSON.parse(localStorage.getItem('latestApplication') || 'null')?.mobile || '')
  const [application, setApplication] = useState(() => JSON.parse(localStorage.getItem('latestApplication') || 'null'))
  const [error, setError] = useState('')

  async function trackApplication() {
    setError('')
    try {
      const res = await API.get('/applications/track', { params: { applicationId, mobile } })
      setApplication(res.data.application)
      localStorage.setItem('latestApplication', JSON.stringify(res.data.application))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not track application. Check backend connection.')
    }
  }

  const currentStatus = application?.status || 'Under Review'

  return (
    <section className="workflow-page">
      <div className="workflow-container">
        <button className="back-link" onClick={() => go('home')}>← Home</button>
        <div className="card form-card wide">
          <h1>Track Your Application</h1>
          <p>Enter Application ID and mobile number to check live status from backend.</p>
          <div className="form-grid">
            <label>Application ID<input value={applicationId} onChange={(e) => setApplicationId(e.target.value)} /></label>
            <label>Mobile Number<input value={mobile} onChange={(e) => setMobile(e.target.value)} /></label>
          </div>
          <button className="btn btn-primary" onClick={trackApplication}>Track Now</button>
          {error && <p className="error-text">{error}</p>}
          {application && <div className="track-top"><span>Application ID<br /><b>{application.applicationId}</b></span><span>Status<br /><b>{currentStatus}</b></span></div>}
          <div className="timeline">
            {['Application Submitted', 'Under Review', 'Document Verification', 'Approval', 'Disbursed'].map((s, i) => (
              <div className={`time-item ${i <= 1 ? 'done' : ''}`} key={s}><span>{i <= 1 ? '✓' : i + 1}</span><div><h4>{s}</h4><p>{s === currentStatus || i <= 1 ? 'Completed / Active' : 'Pending'}</p></div></div>
            ))}
          </div>
          <button className="btn btn-outline" onClick={() => go('admin')}>Open Admin View</button>
        </div>
      </div>
    </section>
  )
}

function AdminPage({ go }) {
  const fallbackRows = [
    { applicationId: 'LEP12345678', fullName: 'Ramesh Kumar', loanType: 'Personal Loan', requiredAmount: 850000, status: 'Under Review' },
    { applicationId: 'LEV9054321', fullName: 'Suresh Yadav', loanType: 'Vehicle Loan', requiredAmount: 425000, status: 'Pending' },
  ]
  const [applications, setApplications] = useState(fallbackRows)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await API.get('/applications')
        setApplications(res.data.applications)
      } catch (err) {
        setError('Backend not running, showing demo applications.')
      }
    }
    loadApplications()
  }, [])

  return (
    <section className="workflow-page admin-page">
      <aside className="admin-side"><h2>LoanEase</h2>{['Dashboard','Applications','Users','Loans','Documents','Reports','Settings'].map((x,i)=><button className={i===1?'active':''} key={x}>{x}</button>)}</aside>
      <div className="admin-main">
        <div className="admin-head"><h1>Admin Dashboard</h1><button onClick={() => go('home')}>Exit</button></div>
        <div className="card admin-card">
          <h2>Applications</h2>
          {error && <p className="error-text">{error}</p>}
          <div className="admin-tabs"><span>All ({applications.length})</span><span>Pending</span><span>Under Review</span><span>Approved</span></div>
          <table><thead><tr><th>Application ID</th><th>Name</th><th>Loan Type</th><th>Amount</th><th>Status</th></tr></thead><tbody>{applications.map(r=><tr key={r.applicationId}><td>{r.applicationId}</td><td>{r.fullName}</td><td>{r.loanType}</td><td>{money(r.requiredAmount || 0)}</td><td><span className="status">{r.status}</span></td></tr>)}</tbody></table>
        </div>
      </div>
    </section>
  )
}

export default function LoanWorkflow({ page }) {
  const navigate = useNavigate()
  const { product: productParam } = useParams()
  const product = productParam === 'vehicle' ? 'vehicle' : 'personal'

  const go = (next, nextProduct = product) => {
    const safeProduct = nextProduct === 'vehicle' ? 'vehicle' : 'personal'
    const routes = {
      home: '/',
      detail: `/loans/${safeProduct}`,
      eligibility: `/eligibility/${safeProduct}`,
      apply: `/apply/${safeProduct}`,
      documents: `/upload-documents/${safeProduct}`,
      submitted: `/application-submitted/${safeProduct}`,
      track: `/track-application/${safeProduct}`,
      admin: '/admin',
    }

    navigate(routes[next] || '/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  if (page === 'detail') return <DetailPage product={product} go={go} />
  if (page === 'eligibility') return <EligibilityPage product={product} go={go} />
  if (page === 'apply') return <ApplyPage product={product} go={go} />
  if (page === 'documents') return <DocumentsPage product={product} go={go} />
  if (page === 'submitted') return <SubmittedPage product={product} go={go} />
  if (page === 'track') return <TrackPage product={product} go={go} />
  if (page === 'admin') return <AdminPage go={go} />
  return null
}
