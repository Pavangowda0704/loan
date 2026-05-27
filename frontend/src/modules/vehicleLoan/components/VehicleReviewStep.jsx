import React from 'react'

const VehicleReviewStep = ({ data }) => (
  <div className="review-step">
    <h3>Review Your Vehicle Loan Application</h3>
    <pre style={{ textAlign: 'left', fontSize: '0.85rem' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
)

export default VehicleReviewStep
