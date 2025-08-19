require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.DATABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing DATABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('Using DATABASE_URL:', supabaseUrl);

// Ensure we're using the correct Supabase REST URL, not the PostgreSQL URL
const supabase = createClient(
  'https://zfiolcrwtfotjbhblpoi.supabase.co', // Replace with your Supabase project URL
  supabaseKey
);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('tickets').select('count').single();
    if (error) throw error;
    console.log('Database connection successful:', data);
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
}

testConnection();
