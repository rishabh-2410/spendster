
/** 
    Select all expenses for a user, needs a user id
*/
SELECT * FROM expenses
WHERE user_id='5122613a-4814-4349-9c6f-888261c202e5';



/** 
    Select single expenses for a user, needs a user id, expense id
*/
SELECT * FROM expenses
WHERE user_id='5122613a-4814-4349-9c6f-888261c202e5'
AND id='2a70c459-85e9-4b6a-b16f-5884aaff6d4c';