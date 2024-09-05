-- Add migration script here
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    initialized BOOLEAN,
    downloadable BOOLEAN
);

-- CREATE TABLE IF NOT EXISTS magic_elements (
--     id UUID PRIMARY KEY,
--     game_id SMALLINT,
--     book_id UUID REFERENCES books(id),
--     name VARCHAR(30),
--     enabled BOOLEAN
-- );