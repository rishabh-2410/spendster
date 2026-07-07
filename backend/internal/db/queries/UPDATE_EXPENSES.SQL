UPDATE expenses
SET 
    amount=COALESCE(NULL, amount),
    category=COALESCE('TV', category)
WHERE id = '2a70c459-85e9-4b6a-b16f-5884aaff6d4c'