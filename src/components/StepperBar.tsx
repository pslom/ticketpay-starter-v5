export default function StepperBar({ step }: { step: 1 | 2 }) {
  return (
    <div className="progress">
      <div className="progress-bar" style={{ width: step === 1 ? '50%' : '100%' }} />
    </div>
  )
}
