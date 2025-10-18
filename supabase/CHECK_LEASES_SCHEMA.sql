-- Check the actual schema of the leases table
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'leases'
ORDER BY ordinal_position;
