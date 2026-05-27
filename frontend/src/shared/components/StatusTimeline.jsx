import React from 'react'

const STATUS_STEPS = ['Submitted', 'Under Review', 'Approved', 'Disbursed']

const StatusTimeline = ({ currentStatus }) => {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus)
  return (
    <div className="status-timeline">
      {STATUS_STEPS.map((step, i) => (
        <div key={step} className={`timeline-step ${i <= currentIndex ? 'completed' : ''}`}>
          <div className="timeline-dot" />
          <span>{step}</span>
        </div>
      ))}
    </div>
  )
}

export default StatusTimeline
