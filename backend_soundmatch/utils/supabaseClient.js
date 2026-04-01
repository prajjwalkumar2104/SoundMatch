const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a single supabase client for the entire app
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;