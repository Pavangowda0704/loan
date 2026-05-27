import React from 'react'
import '../vehicleLoan.css'

const VehicleLoanCard = ({ title, value }) => (
  <div className="loan-card">
    <span className="loan-card-label">{title}</span>
    <span className="loan-card-value">{value}</span>
  </div>
)

export default VehicleLoanCard
