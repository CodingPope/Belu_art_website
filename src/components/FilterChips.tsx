'use client'

import { useState } from 'react'

type FilterChipsProps = {
  filters: { label: string; value: string }[]
  items: HTMLElement[] | null
  targetId: string
}

export function FilterChips({
  filters,
  targetId,
}: FilterChipsProps) {
  const [active, setActive] = useState('all')

  function handleFilter(value: string) {
    setActive(value)
    const scope = document.getElementById(targetId)
    if (!scope) return
    scope.querySelectorAll<HTMLElement>('[data-cat]').forEach((item) => {
      const cats = (item.getAttribute('data-cat') || '').split(' ')
      item.style.display = value === 'all' || cats.includes(value) ? '' : 'none'
    })
  }

  return (
    <div className="cat-filters" role="group" aria-label="Filter works">
      <button
        className={`chip ${active === 'all' ? 'on' : ''}`}
        onClick={() => handleFilter('all')}
        aria-pressed={active === 'all'}
      >
        All
      </button>
      {filters.map((f) => (
        <button
          key={f.value}
          className={`chip ${active === f.value ? 'on' : ''}`}
          onClick={() => handleFilter(f.value)}
          aria-pressed={active === f.value}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
