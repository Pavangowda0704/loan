function ApplicationStepper({ currentStep = 1 }) {
  const steps = ["Personal Info", "Employment Info", "Loan Details", "Review"];

  return (
    <div className="application-stepper">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        return (
          <div
            className={`stepper-item ${
              currentStep >= stepNumber ? "active" : ""
            }`}
            key={step}
          >
            <span>{stepNumber}</span>
            <p>{step}</p>
          </div>
        );
      })}
    </div>
  );
}

export default ApplicationStepper;