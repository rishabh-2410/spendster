
/** 
    Select all expenses for a user, needs a user id
*/
SELECT * FROM expenses
WHERE user_id=?;



/** 
    Select single expenses for a user, needs a user id, expense id
*/
SELECT * FROM expenses
WHERE user_id=?
AND id=?;