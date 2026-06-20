import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connect',
  description: "Commission inquiries, originals, stockist questions, or just say hi. Belu reads every message herself.",
}

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return children
}
