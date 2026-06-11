/* ============================================
   CallToAction.jsx
   Edit the heading, subtext, and button below
   ============================================ */
import './CallToAction.css'

export default function CallToAction() {
  return (
    <section className="cta" id="apply" aria-label="Get started call to action">
      <div className="container cta__inner">
        <div className="cta__text">
          {/* === EDIT: heading & subtext === */}
          <h2 className="cta__heading">Ready to Get Started?</h2>
          <p className="cta__sub">Start your loan application today and take the first step towards your dreams.</p>
        </div>
        {/* === EDIT: button label & link === */}
        <a href="#loans" className="btn btn-white cta__btn">
          Apply Now →
        </a>
      </div>

      {/* Decorative blobs */}
      <span className="cta__blob cta__blob--1" aria-hidden="true" />
      <span className="cta__blob cta__blob--2" aria-hidden="true" />
    </section>
  )
}