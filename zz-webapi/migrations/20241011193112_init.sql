-- Add migration script here
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    directory TEXT,
    initialized BOOL DEFAULT FALSE,
    downloadable BOOL DEFAULT FALSE,
    major_version SMALLINT DEFAULT 0,
    minor_version SMALLINT DEFAULT 0,
    patch_version SMALLINT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS wizforms (
    id UUID PRIMARY KEY,
    book_id UUID REFERENCES books(id),
    game_id VARCHAR(50),
    element SMALLINT,
    magics JSON,
    number SMALLINT,
    hitpoints SMALLINT,
    agility SMALLINT,
    jump_ability SMALLINT,
    precision SMALLINT,
    evolution_form SMALLINT,
    evolution_level SMALLINT,
    exp_modifier SMALLINT,
    enabled BOOL DEFAULT TRUE,
    filters JSON,
    description TEXT,
    icon64 TEXT,
    spawn_points JSON,
    name BYTEA
);