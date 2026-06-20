import React from 'react'

type IconProps = {
  className?: string
  style?: React.CSSProperties
}

export function StarIcon({ className = 'star', style }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" style={style}>
      <path d="M12 0c.8 5.6 1.9 9.2 4.6 9.9.1.4 2.6.9 7.4 2.1-5.6.8-9.2 1.9-9.9 4.6-.4.1-.9 2.6-2.1 7.4-.8-5.6-1.9-9.2-4.6-9.9C7 13.7 4.5 13.2 0 12c5.6-.8 9.2-1.9 9.9-4.6C10.3 7 10.8 4.5 12 0Z" />
    </svg>
  )
}

export function ArrowIcon({ className = 'ar', style }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 30 12" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, ...style }}>
      <path d="M1 6h27M22 1l6 5-6 5" />
    </svg>
  )
}

export function CartIcon({ className, style }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" style={style}>
      <path style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }} d="M3 4h2l2.2 11.2a1 1 0 0 0 1 .8h8.4a1 1 0 0 0 1-.8L20 7H6" />
      <circle cx="9.5" cy="20" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="20" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function MenuIcon() {
  return (
    <svg viewBox="0 0 30 30" style={{ width: 30, height: 30 }}>
      <path style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }} d="M4 9h22M4 16h22M4 23h14" />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 30 30" style={{ width: 30, height: 30 }}>
      <path style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }} d="M7 7l16 16M23 7L7 23" />
    </svg>
  )
}

export function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, color: 'var(--red)' }}>
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16l5 5M11 8v6M8 11h6" />
    </svg>
  )
}
