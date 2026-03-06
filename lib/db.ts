import { neon } from '@neondatabase/serverless'

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  return neon(process.env.DATABASE_URL)
}

export type Subscriber = {
  id: string
  name: string
  email: string
  phone: string | null
  level: string | null
  motivation: string | null
  created_at: string
}
