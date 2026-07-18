SELECT * FROM expenses
WHERE user_id=?
AND date_of_expense BETWEEN ? AND ?
ORDER BY date_of_expense DESC;