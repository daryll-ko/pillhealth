  import { createClient } from '@supabase/supabase-js'

  const supabaseInfos = {
    url: "https://edowhynlffzyrilmhnub.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkb3doeW5sZmZ6eXJpbG1obnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3NDg1OTksImV4cCI6MjAzMTMyNDU5OX0.-awGwmEisumPSSMKWBKERGTvjuGKrkNdvkRWY_5z-uQ"
}
  export const supabase = createClient(supabaseInfos.url, supabaseInfos.key)