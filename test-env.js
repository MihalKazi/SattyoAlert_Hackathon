require('dotenv').config({ path: '.env.local' });
console.log("URL:", process.env.SUPABASE_URL);
console.log("KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "EXISTS" : "MISSING");