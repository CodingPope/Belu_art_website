import type { Payload } from 'payload'

/** Adds an email to the subscriber list unless it is already there. Emails are stored lowercased. */
export async function addSubscriber(
  payload: Payload,
  rawEmail: string,
  source: string,
): Promise<'created' | 'exists'> {
  const email = rawEmail.trim().toLowerCase()

  const existing = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (existing.docs.length > 0) return 'exists'

  await payload.create({
    collection: 'subscribers',
    data: { email, source: source as never },
  })
  return 'created'
}
