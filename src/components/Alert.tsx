import { StarIcon } from './Icons'

type AlertProps = {
  heading: string
  body: string
  signature?: string
}

export function Alert({ heading, body, signature }: AlertProps) {
  return (
    <div className="alert-banner" data-r>
      <svg
        className="alert-andes"
        viewBox="0 0 13 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M1 0L12 20L1 40L12 60L1 80L12 100L1 120L12 140L1 160L12 180L1 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
        />
      </svg>
      <div className="alert-content">
        <span className="eyebrow">
          <StarIcon className="star" />
          Announcement
        </span>
        <p className="alert-heading">{heading}</p>
        <p className="alert-body">
          {body}
          {signature && <span className="alert-sig">{signature}</span>}
        </p>
      </div>
    </div>
  )
}
