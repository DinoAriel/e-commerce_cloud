/**
 * Script untuk membuat tabel di Supabase database
 * Jalankan dengan: node database/setup.mjs
 */

const SUPABASE_URL = 'https://zuuyevfyhirtvowptlyb.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dXlldmZ5aGlydHZvd3B0bHliIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYyNTE0NSwiZXhwIjoyMDkxMjAxMTQ1fQ.yJvxIf9lxUoTZ1Y9_ctWBdH6zG2eKVZkylFxooa7cys'

// Use the Supabase PostgreSQL HTTP API to execute SQL
async function executeSql(sql, label) {
  console.log(`\n⏳ Running: ${label}...`)
  
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })
  
  if (!res.ok) {
    const text = await res.text()
    console.error(`❌ Failed: ${label}`)
    console.error(`   Status: ${res.status}`)
    console.error(`   Response: ${text}`)
    return false
  }
  
  console.log(`✅ Success: ${label}`)
  return true
}

// Execute SQL directly via pg endpoint
async function executeSqlDirect(sql, label) {
  console.log(`\n⏳ Running: ${label}...`)

  const res = await fetch(`${SUPABASE_URL}/pg`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`❌ Failed: ${label} (Status: ${res.status})`)
    console.error(`   ${text.substring(0, 200)}`)
    return false
  }

  console.log(`✅ Success: ${label}`)
  return true
}

// Create tables one by one using the Supabase REST API
async function createTablesViaRest() {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // Test connection first
  console.log('🔌 Testing Supabase connection...')
  const { data, error } = await supabase.from('categories').select('count').limit(1)
  
  if (error && error.code === 'PGRST116') {
    console.log('✅ Connection OK (table exists but empty)')
  } else if (error && error.message.includes('not find the table')) {
    console.log('✅ Connection OK (tables need to be created)')
    console.log('')
    console.log('═══════════════════════════════════════════════════')
    console.log('  ⚠️  Tables do not exist yet!')
    console.log('  Please run schema.sql in Supabase SQL Editor:')
    console.log('  1. Go to: https://supabase.com/dashboard/project/zuuyevfyhirtvowptlyb/sql/new')
    console.log('  2. Copy-paste the contents of database/schema.sql')
    console.log('  3. Click "Run"')
    console.log('  4. Then copy-paste database/seed_data.sql and "Run"')
    console.log('═══════════════════════════════════════════════════')
  } else if (!error) {
    console.log('✅ Connection OK - tables already exist!')
    console.log(`   Found categories table`)
    
    // Check products
    const { data: products } = await supabase.from('products').select('count')
    console.log(`   Found products table`)
    
    // Count products
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
    console.log(`   Products count: ${count}`)
    
    if (count === 0) {
      console.log('')
      console.log('  ⚠️  Tables exist but are empty!')
      console.log('  Run seed_data.sql in Supabase SQL Editor to add initial data.')
    }
  } else {
    console.error('❌ Connection failed:', error.message)
  }
}

createTablesViaRest().catch(console.error)
