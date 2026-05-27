// ============================================================
//  pages/Home.jsx — Assembles all homepage sections
// ============================================================
import React from 'react'
import Hero from '../components/Hero'
import LoanTypes from '../components/LoanTypes'
import HowItWorks from '../components/HowItWorks'
import EmiCalculator from '../components/EmiCalculator'
import FeatureHighlights from '../components/FeatureHighlights'
import Testimonials from '../components/Testimonials'
import FinancialInsights from '../components/FinancialInsights'
import FAQ from '../components/FAQ'
import CallToAction from '../components/CallToAction'

function Home() {
  return (
    <>
      <Hero />
      <LoanTypes />
      <HowItWorks />
      <EmiCalculator />
      <FeatureHighlights />
      <Testimonials />
      <FinancialInsights />
      <FAQ />
      <CallToAction />
    </>
  )
}

export default Home
