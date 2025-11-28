INSERT INTO locations (x, y, z, name) VALUES 
    (100, 200, 300, 'Moscow'),
    (150, 250, 350, 'Saint Petersburg'),
    (200, 300, 400, 'Berlin'),
    (250, 350, 450, 'Paris'),
    (300, 400, 500, 'Madrid');

INSERT INTO persons (name, x, y, creationdate, eyecolor, haircolor, location_id, height, weight, passportid, nationality) 
VALUES 
    ('Ivan Petrov', 100, 200, NOW(), 'BLUE', 'BLACK', 1, 180, 75.5, 'RU1234567', 'GERMANY'),
    ('Maria Smirnova', 200, 300, NOW(), 'GREEN', 'BROWN', 1, 165, 60.0, 'RU2345678', 'FRANCE'),
    ('John Smith', 300, 400, NOW(), 'BROWN', 'BLUE', 3, 175, 80.0, 'US1234567', 'GERMANY'),
    ('Anna Mueller', 150, 250, NOW(), 'BLUE', 'WHITE', 3, 170, 65.0, 'DE1234567', 'GERMANY'),
    ('Pierre Dubois', 250, 350, NOW(), 'BLACK', 'BLACK', 4, 178, 78.5, 'FR1234567', 'FRANCE'),
    ('Carlos Garcia', 350, 450, NOW(), 'BROWN', 'BROWN', 5, 172, 70.0, 'ES1234567', 'SPAIN'),
    ('Elena Ivanova', 120, 220, NOW(), 'GREEN', 'BROWN', 2, 168, 62.5, 'RU3456789', 'FRANCE'),
    ('Hans Schmidt', 280, 380, NOW(), 'BLUE', 'WHITE', 3, 182, 85.0, 'DE2345678', 'GERMANY'),
    ('Marie Laurent', 320, 420, NOW(), 'GREEN', 'BLACK', 4, 163, 58.0, 'FR2345678', 'FRANCE'),
    ('Miguel Rodriguez', 180, 280, NOW(), 'BROWN', 'BROWN', 5, 176, 73.0, 'ES2345678', 'SPAIN'),
    ('Olga Kozlova', 140, 240, NOW(), 'BLUE', NULL, 2, 171, 67.0, 'RU4567890', 'GERMANY'),
    ('Francesco Rossi', 260, 360, NOW(), 'BLACK', 'BLACK', NULL, 169, 72.0, 'IT1234567', 'VATICAN'),
    ('Sofia Gonzalez', 340, 440, NOW(), 'BROWN', 'BROWN', 5, 160, 55.0, 'ES3456789', 'SPAIN'),
    ('Thomas Müller', 190, 290, NOW(), 'BLUE', 'WHITE', 3, 185, 88.0, 'DE3456789', 'GERMANY'),
    ('Isabella Romano', 270, 370, NOW(), 'GREEN', NULL, NULL, 166, 61.0, 'IT2345678', 'VATICAN');

SELECT COUNT(*) as total_persons FROM persons;
SELECT COUNT(*) as total_locations FROM locations;

SELECT 
    nationality,
    COUNT(*) as count,
    AVG(height) as avg_height,
    AVG(weight) as avg_weight
FROM persons
WHERE nationality IS NOT NULL
GROUP BY nationality
ORDER BY count DESC;

