-- SELECT 
--     SUM(amount) AS todays_spent

-- FROM expenses
-- WHERE user_id='5122613a-4814-4349-9c6f-888261c202e5'
-- AND date_of_expense BETWEEN '2026-06-21 00:00:00+00:00' AND '2026-06-21 23:59:59+00:00'



SELECT
    COALESCE(
        SUM(
            CASE
                WHEN DATE(date_of_expense) = CURRENT_DATE
                THEN amount
                ELSE 0
            END
        ),
        0
    ) AS today_spent,

    COALESCE(
        SUM(
            CASE
                WHEN DATE_TRUNC('month', date_of_expense) = DATE_TRUNC('month', CURRENT_DATE)
                THEN amount
                ELSE 0
            END
        ),
        0
    ) AS month_spent,

    COUNT(*) AS total_expenses

FROM expenses
WHERE user_id = '5122613a-4814-4349-9c6f-888261c202e5'