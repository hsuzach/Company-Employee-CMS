USE company_db;

INSERT INTO department
    (name)
VALUES
    ('Marketing'),
    ('Game Art'),
    ('Game Dev'),
    ('Esports');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Producer', 100000, 1),
    ('Media Manager', 80000, 1),
    ('Concept Art Lead', 150000, 2),
    ('Concept Artist', 120000, 2),
    ('Game Designer', 160000, 3),
    ('Game Developer', 125000, 3),
    ('Esports Director', 250000, 4),
    ('Esports President', 190000, 4);

INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7, NULL),
    ('Tom', 'Allen', 8, 7);
