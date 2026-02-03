import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load .env.local
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdmin() {
  const email = 'contact@nands.tech'
  const password = 'youtopia1234'
  const role = 'admin'

  console.log(`Creating admin user: ${email} ...`)

  // Check if user already exists
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    console.error('Failed to list users:', listError.message)
    process.exit(1)
  }

  const existing = existingUsers.users.find((u) => u.email === email)
  if (existing) {
    console.log(`User ${email} already exists (id: ${existing.id})`)
    // Update role in user_metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
      user_metadata: { role },
    })
    if (updateError) {
      console.error('Failed to update user metadata:', updateError.message)
      process.exit(1)
    }
    console.log(`Updated role to "${role}" for existing user.`)

    // Also update profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: existing.id, role, email, display_name: 'Admin' }, { onConflict: 'id' })
    if (profileError) {
      console.error('Failed to upsert profile:', profileError.message)
    } else {
      console.log('Profile updated.')
    }

    console.log('Done!')
    return
  }

  // Create new user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role },
  })

  if (error) {
    console.error('Failed to create user:', error.message)
    process.exit(1)
  }

  console.log(`User created: ${data.user.id}`)

  // Insert into profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: data.user.id, role, email, display_name: 'Admin' }, { onConflict: 'id' })
  if (profileError) {
    console.error('Failed to upsert profile:', profileError.message)
  } else {
    console.log('Profile created.')
  }

  console.log('Done!')
}

createAdmin()
