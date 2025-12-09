-- Migration til at holde hashede pinkoder for alle events fra understory
-- event_id er en unik identifikator for hver event (a3eb56f4a29fb75acfc10d7cf4d25646 er et eksempel)
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(32) NOT NULL,
    email VARCHAR(255) NOT NULL,
    pincode VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)