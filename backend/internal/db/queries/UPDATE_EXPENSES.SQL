UPDATE expenses
SET 
    amount=COALESCE(NULL, amount),
    category=COALESCE('TV', category)
WHERE id = '2a70c459-85e9-4b6a-b16f-5884aaff6d4c'


ALTER TABLE expenses
ALTER COLUMN date_of_expense TYPE DATE
USING date_of_expense::DATE;