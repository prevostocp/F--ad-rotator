
// // Configura Supabase
// const supabaseUrl = 'https://ewaqfqtlbknrzzxeamuv.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3YXFmcXRsYmtucnp6eGVhbXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzODkzODAsImV4cCI6MjA2Mzk2NTM4MH0.VRVStkqzAJhADyAXxFs_IO9JyKU3bTlusnWXzw_1fOU';

// const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// export default supabase;

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
    'https://ewaqfqtlbknrzzxeamuv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3YXFmcXRsYmtucnp6eGVhbXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzODkzODAsImV4cCI6MjA2Mzk2NTM4MH0.VRVStkqzAJhADyAXxFs_IO9JyKU3bTlusnWXzw_1fOU'
)