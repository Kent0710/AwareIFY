import { type NextRequest } from 'next/server'
import { updateSession } from './lib/db/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
     '/', '/home', '/settings'
  ],
}