UPDATE expenses
SET 
    amount=COALESCE(?, amount),
    category=COALESCE(?, category)
WHERE id = ?


ALTER TABLE expenses
ALTER COLUMN date_of_expense TYPE DATE
USING date_of_expense::DATE;