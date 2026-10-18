'use client'

import Image from 'next/image'

export type OptionCard = {
  value: string
  label: string
  /** Short supporting line, e.g. "A custom piece" or "Archival matte" */
  note?: string
  /** Visible comparison info, e.g. a price or "8 × 10 in" */
  detail?: string
  /** Optional image swatch (paper texture, frame colour, product photo) */
  imageSrc?: string | null
  disabled?: boolean
}

type OptionCardsProps = {
  name: string
  legend: string
  options: OptionCard[]
  value: string
  onChange: (value: string) => void
  /** Minimum card width; smaller for text-only choices, larger for image swatches */
  minWidth?: number
  /** On small screens, show text-only options as wrapping chips without their notes */
  compact?: boolean
}

/*
 * "Show, don't dropdown": a radio group rendered as visible cards so shoppers
 * can compare every choice at a glance. Use this instead of <select> for
 * shopper-facing choices (inquiry type, print size, paper, frame, edition…).
 * Native radios underneath keep keyboard (arrow keys) and screen-reader behaviour.
 */
export function OptionCards({ name, legend, options, value, onChange, minWidth = 140, compact = false }: OptionCardsProps) {
  return (
    <fieldset className={`optc${compact ? ' optc--compact' : ''}`}>
      <legend className="kicker">{legend}</legend>
      <div className="optc-grid" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))` }}>
        {options.map((opt) => (
          <label key={opt.value} className={`optc-opt${opt.disabled ? ' is-disabled' : ''}`}>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              disabled={opt.disabled}
              onChange={() => onChange(opt.value)}
            />
            <span className="optc-card">
              {opt.imageSrc && (
                <span className="optc-img">
                  <Image src={opt.imageSrc} alt="" fill sizes={`${minWidth * 2}px`} style={{ objectFit: 'cover' }} />
                </span>
              )}
              <span className="t">{opt.label}</span>
              {opt.note && <span className="n">{opt.note}</span>}
              {opt.detail && <span className="d">{opt.detail}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
