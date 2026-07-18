UPDATE refresh_tokens
SET 
    revoked_at=NOW()
WHERE user_id=?