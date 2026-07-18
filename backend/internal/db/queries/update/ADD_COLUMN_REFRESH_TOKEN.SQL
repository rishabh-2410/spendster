ALTER TABLE refresh_tokens
ADD COLUMN expires_at TIMESTAMPTZ;

UPDATE refresh_tokens
SET expires_at = created_at + INTERVAL '30 days'
WHERE expires_at IS NULL;

ALTER TABLE refresh_tokens
ALTER COLUMN expires_at SET NOT NULL;


ALTER TABLE refresh_tokens
ADD CONSTRAINT unique_refresh_token_hash
UNIQUE (token_hash);
