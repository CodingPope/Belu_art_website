import type { Metadata } from 'next'
import Link from 'next/link'
import { CartIcon, StarIcon } from '@/components/Icons'

export const metadata: Metadata = {
  title: 'Cart',
}
import { EmailSignup } from '@/components/EmailSignup'

export default function CartPage() {
  return (
    <div className="section">
      <div className="wrap">
        <div className="cart-empty" data-r>
          <span className="ic">
            <svg style={{ width: 46, height: 46, fill: 'none', stroke: 'currentColor', strokeWidth: 1.3 }}>
              <CartIcon />
            </svg>
          </span>
          <h2>Your cart is quiet for now</h2>
          <p>
            The shop is between collections, so there&apos;s nothing to check out just yet. Join the list for first access to the next drop, or wander the gallery while you&apos;re here.
          </p>
          <div className="brow">
            <Link className="btn" href="/gallery">
              Explore gallery <StarIcon className="star" />
            </Link>
            <Link className="ghost" href="/shop">
              Back to shop
            </Link>
          </div>
        </div>
        <div className="cart-card" data-r>
          <div className="kicker">First access</div>
          <h3>Join the list</h3>
          <p>Be first to know when the new collection lands, with prints, originals, and small joys.</p>
          <EmailSignup id="joinCart" source="cart" />
        </div>
      </div>
    </div>
  )
}
