// PUT THIS IN BACKEND/CONFIG/SUPABASE.JS
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase once and export it
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;