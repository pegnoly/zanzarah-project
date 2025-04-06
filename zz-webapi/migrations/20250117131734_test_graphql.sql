-- Add migration script here
CREATE TABLE IF NOT EXISTS graphs(
    id INT PRIMARY KEY,
    name VARCHAR(100),
    count INT
)

INSERT INTO graphs(id, name, count) VALUES (0, "test0", 0);
INSERT INTO graphs(id, name, count) VALUES (1, "test0", 1);
INSERT INTO graphs(id, name, count) VALUES (2, "test0", 2);