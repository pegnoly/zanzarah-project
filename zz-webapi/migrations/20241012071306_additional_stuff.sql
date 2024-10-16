-- Add migration script here
CREATE TABLE IF NOT EXISTS elements (
    id UUID,
    book_id UUID REFERENCES books(id),
    name VARCHAR(50),
    element SMALLINT,
    enabled BOOL
);

CREATE TABLE IF NOT EXISTS filters (
    id UUID,
    book_id UUID REFERENCES books(id),
    name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS spawn_points (
    id UUID,
    book_id UUID REFERENCES books(id),
    name VARCHAR(200)
);