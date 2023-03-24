import { createClient } from "@supabase/supabase-js"

const supabaseKey = process.env.SUPABASE_KEY

export const realtime = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!,
  { realtime: { params: { eventsPerSecond: 10 } } }
)
