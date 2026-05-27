// PersonalReviewStep — review summary before final submission
// Extend this component with your review UI as needed.
import React from 'react'

const PersonalReviewStep = ({ data }) => (
  <div className="review-step">
    <h3>Review Your Application</h3>
    <pre style={{ textAlign: 'left', fontSize: '0.85rem' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
)

export default PersonalReviewStep
